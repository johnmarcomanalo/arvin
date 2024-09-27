import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useSearchParams } from "react-router-dom";
import { change } from "redux-form";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { decryptaes } from "../../../../../utils/LightSecurity";
import { getSalesQuotations } from "../actions/QuotationListActions";
import moment from "moment";
import { ViewSalesQuotation } from "../actions/QuotationListActions";
const QuotationListHooks = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    selectedDataList: [],
    status: [
      {
        description: "All",
      },
      {
        description: "Pending",
      },
      {
        description: "Approved",
      },
      {
        description: "Denied",
      },
    ],
  });
  const selectedDataList = useSelector(
    (state) => state.QuotationReducer.selectedDataList
  );
  const refresh = useSelector((state) => state.QuotationReducer.refresh);
  const viewModal = useSelector((state) => state.QuotationReducer.viewModal);
  const printModal = useSelector((state) => state.QuotationReducer.printModal);
  const reportModal = useSelector(
    (state) => state.QuotationReducer.reportModal
  );
  const dataList = useSelector((state) => state.QuotationReducer.dataList);
  const [searchParams, setSearchParams] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const filterStartQuery =
    searchParams.get("fs") != null
      ? String(searchParams.get("fs"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery =
    searchParams.get("fe") != null
      ? String(searchParams.get("fe"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterStatus =
    searchParams.get("st") != null ? String(searchParams.get("st")) : "All";
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const debounceSearch = useDebounce(searchParams, 500);
  const getListParam = () => {
    const data = {
      // p: page == null ? 1 : page,
      q: search,
      // l: rowsPerPage,
      fs: filterStartQuery,
      fe: filterEndQuery,
      st: filterStatus,
      u: account_details?.code,
    };
    return data;
  };

  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "customer_description", label: "Customer", align: "left" },
    { id: "status", label: "Status", align: "left" },
    { id: "request_date", label: "Date Request", align: "left" },
    { id: "requestor_name", label: "Requestor", align: "left" },
  ];

  const awarded_columns = [
    { id: "product_request_code", label: "Code", align: "left" },
    { id: "status", label: "Status", align: "left" },
    { id: "os_number", label: "OS Number", align: "left" },
    { id: "customer_description", label: "Customer", align: "left" },
    { id: "product_description", label: "Product Description", align: "left" },
    { id: "projected_quantity", label: "Project Quantity", align: "left" },
    { id: "awarded_quantity", label: "Awarded Quantity", align: "left" },
    { id: "unawarded_quantity", label: "Unawarded Quantity", align: "left" },
    { id: "awarded_percentage", label: "Awarded Percentage", align: "left" },
    {
      id: "unawarded_percentage",
      label: "Unawarded Percentage",
      align: "left",
    },
    {
      id: "request_date",
      label: "Request Date",
      align: "left",
    },
  ];
  const onClickSubmit = (status) => {
    props.dispatch(change("ForApprovalQuotation", "status", status));
  };

  const SalesQutoationRequestLists = async () => {
    try {
      const data = getListParam();
      await dispatch(getSalesQuotations(data));
    } catch (error) {
      await console.error(error);
    }
  };

  useEffect(() => {
    SalesQutoationRequestLists();
  }, [refresh, debounceSearch, filterStartQuery, filterEndQuery, filterStatus]);

  useEffect(() => {
    props.initialize({
      approved_by: account_details?.code,
      filter_date_start: filterStartQuery,
      filter_date_end: filterEndQuery,
      filterStatus: filterStatus,
    });
  }, []);
  const onSelectRow = async (e, data) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Check if the data already exists in selectedDataList
      const dataExists = state.selectedDataList.some(
        (item) => item.code === data.code // Use a unique identifier to check for duplicates
      );

      if (!dataExists) {
        // Add data if it does not already exist in the list
        state.selectedDataList.push(data);
        setState((prev) => ({
          ...prev,
          selectedDataList: [...prev.selectedDataList], // Update the state to trigger re-render
        }));
      }
    } else {
      // Remove the data if the checkbox is unchecked
      const updatedList = state.selectedDataList.filter(
        (item) => item.code !== data.code // Use the unique identifier to filter out the unchecked item
      );

      setState((prev) => ({
        ...prev,
        selectedDataList: updatedList, // Update the state with the filtered list
      }));
    }
  };
  const onResetSelectedDataList = () => {
    setState((prev) => ({
      ...prev,
      selectedDataList: [],
    }));
  };

  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      // p: page == null ? 1 : page,
      q: search,
      // l: rowsPerPage,
      fs: filterStartQuery,
      fe: filterEndQuery,
      st: filterStatus,
      u: account_details?.code,
    });
  };
  const onClickOpenViewModal = async (row) => {
    const res = await dispatch(ViewSalesQuotation(row.code));
    let decrypted = await decryptaes(res.data);
    await dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        selectedDataList: decrypted.dataList,
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        viewModal: false,
      },
    });
  };

  const onClickOpenPrintModal = async (row) => {
    if (row.status === "Approved") {
      const res = await dispatch(ViewSalesQuotation(row.code));
      let decrypted = await decryptaes(res.data);
      await dispatch({
        type: Constants.ACTION_QUOTATION,
        payload: {
          selectedDataList: decrypted.dataList,
          printModal: true,
        },
      });
    } else {
      await swal(
        "Oops",
        "This feature is available only for requests that are 'Approved'.",
        "warning"
      );
    }
  };
  const onClickClosePrintModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        printModal: false,
      },
    });
  };
  const onChangeFilterStart = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({
      // p: page == null ? 1 : page,
      q: search,
      // l: rowsPerPage,
      fs: newdate,
      fe: filterEndQuery,
      st: filterStatus,
      u: account_details?.code,
    });
  };

  const onChangeFilterEnd = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({
      // p: page == null ? 1 : page,
      q: search,
      // l: rowsPerPage,
      fs: filterStartQuery,
      fe: newdate,
      st: filterStatus,
      u: account_details?.code,
    });
  };

  const onChangeFilterStatus = (status) => {
    setSearchParams({
      // p: page == null ? 1 : page,
      q: search,
      // l: rowsPerPage,
      fs: filterStartQuery,
      fe: filterEndQuery,
      st: status,
      u: account_details?.code,
    });
  };
  const onClickOpenReportModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        reportModal: true,
      },
    });
  };
  const onClickCloseReportModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        reportModal: false,
      },
    });
  };
  return {
    state,
    columns,
    dataList,
    search,
    viewModal,
    selectedDataList,
    printModal,
    reportModal,
    awarded_columns,
    onSelectRow,
    onClickSubmit,
    onResetSelectedDataList,
    onChangeSearch,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onClickOpenPrintModal,
    onClickClosePrintModal,
    onChangeFilterStart,
    onChangeFilterEnd,
    onChangeFilterStatus,
    onClickOpenReportModal,
    onClickCloseReportModal,
  };
};

export default QuotationListHooks;
