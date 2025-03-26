import { cancelRequest } from "api/api";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Constants } from "reducer/Contants";
import { change, reset } from "redux-form";
import swal from "sweetalert";
import { useDebounce } from "utils/HelperUtils";
import { decryptaes } from "utils/LightSecurity";
import {
  getReceiptDetails,
  getReceiptFormatList,
  postCheckCollection,
} from "../actions/CheckCollectionActions";
import {
  getAllRefBankAccounts,
} from "../../../../settings/reference/actions/ReferenceActions";
let formName = "CheckCollection";
const CheckCollectionHooks = (props) => { 
  const navigate          = useNavigate();
  const refresh           = useSelector((state) => state.EpayCheckReducer.refresh);
  const dispatch          = useDispatch();
  const [
      searchParams, 
      setSearchParams
  ] = useSearchParams();
  const search            = searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const code              = searchParams.get("c") != null ? String(searchParams.get("c")) : "";
  const customer_name     = searchParams.get("d") != null ? String(searchParams.get("d")) : "";
  const sap               = searchParams.get("s") != null ? String(searchParams.get("s")) : "";
  const page              = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const debounceSearch    = useDebounce(searchParams, 500);
  const account_details   = useSelector((state) => state.AuthenticationReducer.account_details);
  const access            = useSelector((state) => state.AuthenticationReducer.access);
  const dataList          = useSelector((state) => state.EpayCheckReducer.dataList);
  const dataListCount     = useSelector((state) => state.EpayCheckReducer.dataListCount);
  const viewModal         = useSelector((state) => state.EpayCheckReducer.viewModal);
  const viewModal2        = useSelector((state) => state.EpayCheckReducer.viewModal2);
  const viewModal3        = useSelector((state) => state.EpayCheckReducer.viewModal3);
  const printData         = useSelector((state) => state.EpayCheckReducer.printData); 
  const dataListFormat    = useSelector((state) => state.EpayCheckReducer.dataListFormat); 
  const selectedItem      = useSelector((state) => state.EpayCheckReducer.selectedItem); 
  const banks             = useSelector((state) => state.ReferenceReducer.phbanks);
  const bank_accounts     = useSelector((state) => state.ReferenceReducer.bank_accounts); 
  const receipt_code      = props.receipt_code
  const receipt_number    = props.receipt_number
  const receipt_description = props.receipt_description ?? ""
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 800,
    invoice_list: [],
    advancePayment: false
  });

  const columns = [
    { id: "docno", label: "Document Number", align: "left" },
    { id: "drno", label: "DR Number", align: "left" },
    { id: "sino", label: "SI Number", align: "left" },
    { id: "docdate", label: "Document Date", align: "left" },
    { id: "totalbeforetax", label: "Total Before Tax", align: "left" },
    { id: "vatsum", label: "Vat", align: "left" },
    { id: "doctotal", label: "Total Invoice", align: "left" },
    { id: "form", label: "Form Type", align: "left" },
  ];

  const column_headers = [
    { id: "bp_payment_term", label: "PAYMENT MODE" }, 
    { id: "docno", label: "DOCUMENT NUMBER" },
    { id: "docdate", label: "DOCUMENT DATE" },
    { id: "drno", label: "DR NUMBER" },
    { id: "sino", label: "SI NUMBER" },
    { id: "form", label: "FORM" },
    { id: "vatsum", label: "VAT" },
    { id: "doctotal", label: "TOTAL INVOICE" }
  ];

  const form_type = [
    {  value: "INV", description: "COLLECTION RECEIPT" },
    {  value: "STA", description: "PROVISIONAL RECEIPT" },
  ]

 
  const debounce = useCallback((func, delay) => {
    clearTimeout(state.debounceTimer);
    const timer = setTimeout(func, delay);
    setState((prev) => ({ ...prev, debounceTimer: timer }));
  }, []);
  const GetReceiptDetailsList = async () => {
    try {
      const data = {
        subsection_code:account_details.subsection_code,
        receipt_code:receipt_code ?? "",
        receipt_number:receipt_number ?? ""
      }
      await debounce(() => { 
        dispatch(getReceiptDetails(data)); 
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };

    React.useEffect(() => {
      if (receipt_number && receipt_code){
        GetReceiptDetailsList(); 
      }  
      dispatch(getReceiptFormatList()); 

      // if there is a selected item, reset the state
      if (selectedItem) {
        setState({
          invoice_list: [],
        });
      }
      props.change("card_code", selectedItem?.cardcode);
      props.change("card_name", selectedItem?.cardname); 
      props.change("sap", selectedItem?.sap);
      
      return () => cancelRequest();
    }, [receipt_number,receipt_code,selectedItem]);

    React.useEffect(() => {
      if (state.advancePayment){
        dispatch(getAllRefBankAccounts());
      }
    }, [state.advancePayment]);
  

  // ADD CHECK START FUNCTION AND PROCESS
  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal: false,
      },
    });
  };
  
  const onSelectItem = (row, index) => {
    const isExisting = state.invoice_list.some(
      (item) => item.docno === row.docno && item.sino === row.sino
    );
    if (!isExisting) {
      state.invoice_list.push({
        docno: row.docno,
        sino: row.sino,
        drno: row.drno,
        docdate: row.docdate,
        totalbeforetax: row.totalbeforetax,
        vatsum: row.vatsum,
        doctotal: row.doctotal,
        form: row.form,
        bp_payment_term: row.bp_payment_term,
        internal_approved_term: row.internal_approved_term,
      });
      swal("Success", "Details added successfully", "success");
      setState((prev) => ({
        ...prev,
      }));
    }
  };
  const onClickRemoveInvoiceList = () => {
    state.invoice_list.splice(state.invoice_list.length - 1, 1);
    setState((prev) => ({
      ...prev,
    }));
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.check_number) {
      errors.check_number = "Check number is required";
    }
    if (!values.check_amount || values.check_amount <= 0) {
      errors.check_amount = "Valid check amount is required";
    }
    // Add more validations
    return errors;
  };

  // const submit = async (values, dispatch, props) => {
  //   try {
  //     // First confirmation: "Are you sure you want to submit?" 
  //     const isConfirm = await swal({
  //       title: "Verify check details before submitting",
  //       text: "Are you sure you want to submit?",
  //       icon: "info",
  //       buttons: true,
  //       closeOnClickOutside: false,
  //     });
  //     if (!isConfirm) return;
  
  //     // Submit normally
  //     let res = await dispatch(postCheckCollection(values));
  //     let decrypted = await decryptaes(res?.data);
  
  //     // If backend returned a warning, show a prompt to override
  //     if (decrypted.status === 'warning') {
  //       const override = await swal({
  //         title: decrypted.title,
  //         text:  decrypted.message + " Do you want to proceed anyway?",
  //         icon: "warning",
  //         buttons: ["Cancel", "Proceed"],
  //         dangerMode: true,
  //         customClass: {
  //           htmlContainer: 'custom-swal' // This class is applied to the text container
  //         },
  //         closeOnClickOutside: false,
  //       });
        
  //       if (!override) {
  //         // User canceled; stop the process.
  //         return;
  //       } else {
  //         // Resend the request with the override flag set
  //         values.override_warning = true;
  //         res = await dispatch(postCheckCollection(values));
  //         decrypted = await decryptaes(res?.data);
  //       }
  //     }
  
  //     // If success, proceed with further actions (reset form, show success, etc.)
  //     if (decrypted.result === true) { 
  //       await dispatch(reset(formName));
  //       props.change("bank_description", "");
  //       setSearchParams({});
  //       await dispatch({
  //         type: Constants.ACTION_EPAY_CHECK,
  //         payload: {
  //           refresh: !props.refresh,
  //           selectedItem: {},
  //         },
  //       });
  //       setState((prev) => ({
  //         ...prev,
  //         invoice_list: [],
  //         advancePayment: false
  //       })); 
  //       swal(decrypted.title, decrypted.message, decrypted.status, {
  //         buttons: false,
  //         timer: 1000,
  //       }).then(() => {
  //         if (!decrypted.print.advance_payment) {
  //           setTimeout(() => {
  //             askToPrintReceipt(decrypted.print);
  //           }, 1200);
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     swal({
  //       title: "Error",
  //       text: "An error occurred while processing your request. Please try again.",
  //       icon: "error",
  //     });
  //     console.error("Submit error:", error);
  //   }
  // };

  const submit = async (values, dispatch, props) => {
    try {
      // First confirmation: "Are you sure you want to submit?" 
      const isConfirm = await swal({
        title: "Verify check details before submitting",
        text: "Are you sure you want to submit?",
        icon: "info",
        buttons: true,
        closeOnClickOutside: false,
      });
      if (isConfirm){
         // Submit normally
        let res = await dispatch(postCheckCollection(values));
        let decrypted = await decryptaes(res?.data);
        console.log(decrypted,"dasda");
        
        if (decrypted && decrypted.result){
            await dispatch(reset(formName));
            props.change("bank_description", "");
            props.change("document_type", "");
            props.change("form_description", "");
            setSearchParams({});
            await dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                refresh: !props.refresh,
                selectedItem: {},
              },
            });
            setState((prev) => ({
              ...prev,
              invoice_list: [],
              advancePayment: false
            })); 
            swal(decrypted.title, decrypted.message, decrypted.status, {
              buttons: false,
              timer: 1000,
            }).then(() => {
              setTimeout(() => {
                askToPrintReceipt(decrypted.print);
              }, 1200);
            });
        }
       
      }
  
    } catch (error) {
      swal({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };
  

  const askToPrintReceipt = (data) => { 
    swal({
      title: "Print Receipt",
      text: "Do you want to print the receipt?",
      icon: "info",
      buttons: ["Cancel", "Print"], // Array format: cancel first, then confirm
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((willPrint) => {
      if (willPrint) { // willPrint is `true` if "Print" is clicked, `false` if "Cancel" is clicked
        
        dispatch(change("ReceiptDetailsForm", "receipt_number", data.receipt_number));
        dispatch(change("ReceiptDetailsForm", "receipt_description", data.receipt_description));
        dispatch(change("ReceiptDetailsForm", "receipt_code", data.receipt_code));
        onClickOpenReceiptDetailsModal()
        
      } else {
        console.log("Printing cancelled.");
      }
    });
  };
  

  const onClickOpenReceiptDetailsModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal2: true,
      },
    });
  };
  const onClickCloseReceiptDetailsModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal2: false,
      },
    });
  };

  const onClickOpenCustomerModal = () => {
    setSearchParams({})
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal3: true,
      },
    });
  };
  const onClickCloseCustomerModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal3: false,
      },
    });
  };

  // React.useEffect(() => {
  //   const beforeUnloadHandler = (ev) => {
  //     ev.preventDefault();
  //     return ev.returnValue = "Changes you made may not be saved.";
  //   };
    
  //   window.addEventListener("beforeunload", beforeUnloadHandler);
  //   return () => {
  //     window.removeEventListener("beforeunload", beforeUnloadHandler);
  //   };
  // }, []);

  const handleCheckboxChange = (event) => {
    setState(prevState => ({
      ...prevState,
      advancePayment: event.target.checked
    }));

    props.change("form_type", "");
    props.change("prefix", "");

    if (event.target.checked) {
      setState(prevState => ({
        ...prevState,
        invoice_list: []
      }));
    }
  };

  return {
    banks,
    dataListFormat,
    customer_name,
    account_details,
    columns,
    viewModal,
    viewModal2,
    viewModal3,
    access,
    dataList,
    dataListCount,
    page,
    refresh,
    search,
    code,
    state,
    printData,
    receipt_description,
    receipt_code,
    column_headers, 
    form_type,
    bank_accounts,
    submit,
    dispatch,
    setSearchParams, 
    onClickOpenViewModal,
    onClickCloseViewModal,
    onSelectItem,
    onClickRemoveInvoiceList,
    onClickOpenReceiptDetailsModal,
    onClickCloseReceiptDetailsModal,
    onClickOpenCustomerModal,
    onClickCloseCustomerModal,
    handleCheckboxChange,
  };
};

export default CheckCollectionHooks;
