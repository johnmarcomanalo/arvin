import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useDebounce } from "utils/HelperUtils";
import { useSearchParams, useNavigate } from "react-router-dom";
import { reset } from "redux-form";
import { Constants } from "reducer/Contants";
import { decryptaes } from "utils/LightSecurity";
import { cancelRequest } from "api/api";
import {
  getSalesInvoiceDetails,
  postCheckCollection,
  getReceiptFormat,
} from "../actions/CheckCollectionActions";
import swal from "sweetalert";
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
  const selectedDataList  = useSelector((state) => state.EpayCheckReducer.selectedDataList);
  const printData         = useSelector((state) => state.EpayCheckReducer.printData); 
  const dataListFormat    = useSelector((state) => state.EpayCheckReducer.dataListFormat); 
  const banks           = useSelector((state) => state.ReferenceReducer.phbanks);
  
  const customerDetails   = {}
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
    invoice_list: [],
  });

  const epay_selection = [
    { description: "NO" }, 
    { description: "YES" }
  ];
  const print_format   = [
    { value:"CR" ,description:"COLLECTION RECEIPT" },
    { value:"PR" ,description:"PROVISIONAL RECEIPT"}
  ]

  const columns = [
    { id: "docno", label: "Document Number", align: "left" },
    { id: "sino", label: "SI Number", align: "left" },
    { id: "drno", label: "DR Number", align: "left" },
    { id: "docdate", label: "Document Date", align: "left" },
    { id: "totalbeforetax", label: "Total Before Tax", align: "left" },
    { id: "vatsum", label: "Vat", align: "left" },
    { id: "doctotal", label: "Total Invoice", align: "left" },
  ];

  const getListParam = () => {
    const data = {
      c: code,
      d: customer_name,
      s: sap,
      q: search,
      p: page == null ? 1 : page,
    };
    return data;
  };

  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };

  const GetInvoiceList = async () => {
    try {
      const data = getListParam();
      await debounce(() => {
        dispatch(getSalesInvoiceDetails(data));
        dispatch(getReceiptFormat());
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => {
    GetInvoiceList();
    return () => cancelRequest();
  }, [refresh, debounceSearch]);

  const onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
      c: code,
      d: customer_name,
      s: sap,
      q: search,
      p: page,
    });
  };

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

  // const GetCustomerDetails = async (value) => {
  //   try {
  //     let data = {
  //       customer_code: value.customer_code,
  //       type: value.type,
  //       status: value.status,
  //     };
  //     localStorage.setItem("customerDetails", JSON.stringify(value));
  //     const res = await dispatch(getEmployeeCustomerAccessDetails(data));
  //     const decrypted = decryptaes(res.data);
  //     const customer_details = decrypted.data;
  //     setSearchParams({
  //       c: customer_details.cardcode,
  //       d: customer_details.cardname,
  //       s: customer_details.sap,
  //       q: search,
  //       p: "1",
  //     });

  //     await dispatch({
  //       type: Constants.ACTION_EPAY_CHECK,
  //       payload: {
  //         dataList: [],
  //         dataListCount: 0,
  //       },
  //     });

  //     setState((prev) => ({
  //       ...prev,
  //       invoice_list: [],
  //     }));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getInvoiceList = (data) =>{
    setSearchParams({
      c: data.cardcode,
      d: data.cardname,
      s: data.sap,
      q: search,
      p: "1",
    });
  }

  const handleChangePage = (event, newPage) => {
    setSearchParams({
      c: code,
      d: customer_name,
      s: sap,
      q: search,
      p: page == null ? 1 : newPage,
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

  const submit = async (values, dispatch, props) => {
    try {
      const isConfirm = await swal({
        title: "Verify check details before submitting",
        text: "Are you sure you want to submit?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (isConfirm) {
        const res = await dispatch(postCheckCollection(values));
        let decrypted = await decryptaes(res?.data);

        await dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            refresh: !props.refresh,
          },
        });

        await swal(decrypted.title, decrypted.message, decrypted.status, {
          buttons: false,
          timer: 2000,
        });

        if (decrypted.result === true) {
          localStorage.removeItem("customerDetails");
          await dispatch(reset(formName));
          setSearchParams({ c: "", d: "",s:"", q: "", p: "" });
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
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

  const onClickOpenAccessCustomerModal = () => {
    setSearchParams({});
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal3: true,
      },
    });
  };
  const onClickCloseAccessCustomerModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal3: false,
      },
    });
  };
  
  const getCustomerDetails = (value) =>{  
    getInvoiceList(value);
    props.change("card_code", value.cardcode);
    props.change("card_name", value.cardname); 
    props.change("sap", value.sap); 
    onClickCloseAccessCustomerModal();
    swal("Success", "Customer Details has been selected", "success", {
      buttons: false,
      timer: 800,
    });
  }
  

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
    epay_selection,
    print_format,
    printData,
    submit,
    dispatch,
    setSearchParams,
    GetInvoiceList, 
    getCustomerDetails,
    handleChangePage,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeSearch,
    onSelectItem,
    onClickRemoveInvoiceList,
    onClickOpenReceiptDetailsModal,
    onClickCloseReceiptDetailsModal,
    onClickOpenAccessCustomerModal,
    onClickCloseAccessCustomerModal,
  };
};

export default CheckCollectionHooks;
