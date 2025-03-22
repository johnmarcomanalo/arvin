import { cancelRequest } from "api/api";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Constants } from "reducer/Contants";
import swal from "sweetalert";
import { useDebounce } from "utils/HelperUtils";
import {
  getSalesInvoiceDetails,
} from "../actions/CheckCollectionActions";
let formName = "CheckCollection";
const CheckSalesInvoiceHooks = (props) => {
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
  const selectedItem      = useSelector((state) => state.EpayCheckReducer.selectedItem);
  const printData         = useSelector((state) => state.EpayCheckReducer.printData); 
  const dataListFormat    = useSelector((state) => state.EpayCheckReducer.dataListFormat); 
  const banks             = useSelector((state) => state.ReferenceReducer.phbanks);
  const format            = props.format
  const receipt_number    = props.receipt_number
  const customerDetails   = {}
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
    invoice_list: [],
    sort_by: "asc", // Default sorting order
    order: "docdate", // Default sorting field
  });

  const columns = [
    { id: "bp_payment_term", label: "Payment Mode", align: "left", sortable: true },
    { id: "docno", label: "Document Number", align: "left", sortable: true },
    { id: "sino", label: "SI Number", align: "left", sortable: true },
    { id: "drno", label: "DR Number", align: "left", sortable: true },
    { id: "docdate", label: "Document Date", align: "left", sortable: true },
    { id: "totalbeforetax", label: "Total Before Tax", align: "left", sortable: true },
    { id: "vatsum", label: "Vat", align: "left", sortable: true },
    { id: "doctotal", label: "Total Invoice", align: "left", sortable: true },
    { id: "form", label: "Form Type", align: "left", sortable: true },
  ];

  const getListParam = () => {
    const data = {
      c: selectedItem.cardcode ?? "",
      d: selectedItem.cardname ?? "",
      s: selectedItem.sap ?? "",
      q: search,
      p: page == null ? 1 : page,
      sort_by: state.sort_by,
      order: state.order,
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
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => { 
      GetInvoiceList(); 
    return () => cancelRequest();
  }, [refresh, debounceSearch,selectedItem]);
 

  const onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
      c: selectedItem.cardcode ?? "",
      d: selectedItem.cardname ?? "",
      s: selectedItem.sap ?? "",
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



  const getInvoiceList = (data) =>{
    setSearchParams({
      c: selectedItem.cardcode ?? "",
      d: selectedItem.cardname ?? "",
      s: selectedItem.sap ?? "",
      q: search,
      p: "1",
    });
  }

  const handleChangePage = (event, newPage) => {
    setSearchParams({
      c: selectedItem.cardcode ?? "",
      d: selectedItem.cardname ?? "",
      s: selectedItem.sap ?? "",
      q: search,
      p: page == null ? 1 : newPage,
    });
  };

  const onClickRemoveInvoiceList = () => {
    state.invoice_list.splice(state.invoice_list.length - 1, 1);
    setState((prev) => ({
      ...prev,
    }));
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


  const onChangeSorting = (field, direction) => { 
    setState((prevState) => ({
      ...prevState,
      sort_by: field,
      order: direction,
    }));
  
    setSearchParams({
      c: selectedItem.cardcode ?? "",
      d: selectedItem.cardname ?? "",
      s: selectedItem.sap ?? "",
      q: search,
      p: page,
      sort_by: field,
      order: direction,
    });
   
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
    dispatch,
    setSearchParams,
    GetInvoiceList,
    handleChangePage,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeSearch,
    onChangeSorting,
    onClickRemoveInvoiceList,
    onClickOpenReceiptDetailsModal,
    onClickCloseReceiptDetailsModal,
    onClickOpenAccessCustomerModal,
    onClickCloseAccessCustomerModal,
  };
};

export default CheckSalesInvoiceHooks;
