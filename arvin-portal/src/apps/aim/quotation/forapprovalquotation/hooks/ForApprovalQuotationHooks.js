import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { change } from "redux-form";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { decryptaes } from "../../../../../utils/LightSecurity";
import { ViewSalesQuotation } from "../../myquotationList/actions/MyQuotationListActions";
import { getForApprovalSalesQuotation } from "../actions/ForApprovalQuotationActions";

const ForApprovalQuotationHooks = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    selectedDataList: [],
  });
  const selectedDataList = useSelector(
    (state) => state.QuotationReducer.selectedDataList
  );
  const refresh = useSelector((state) => state.QuotationReducer.refresh);
  const viewModal = useSelector((state) => state.QuotationReducer.viewModal);
  const dataList = useSelector((state) => state.QuotationReducer.dataList);
  const [searchParams, setSearchParams] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const filterStartQuery =
    searchParams.get("fs") != null ? String(searchParams.get("fs")) : "";
  const filterEndQuery =
    searchParams.get("fe") != null ? String(searchParams.get("fe")) : "";
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const debounceSearch = useDebounce(searchParams, 500);
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      fs: filterStartQuery,
      fe: filterEndQuery,
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

  const onClickSubmit = (status) => {
    props.dispatch(change("ForApprovalQuotation", "status", status));
  };

  const GetForApprovalRequestLists = async () => {
    try {
      const data = getListParam();
      await dispatch(getForApprovalSalesQuotation(data));
    } catch (error) {
      await console.error(error);
    }
  };

  useEffect(() => {
    GetForApprovalRequestLists();
  }, [refresh, debounceSearch, filterStartQuery, filterEndQuery]);

  useEffect(() => {
    props.initialize({
      approved_by: account_details?.code,
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
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      fs: filterStartQuery,
      fe: filterEndQuery,
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
  return {
    state,
    columns,
    dataList,
    search,
    viewModal,
    selectedDataList,
    onSelectRow,
    onClickSubmit,
    onResetSelectedDataList,
    onChangeSearch,
    onClickOpenViewModal,
    onClickCloseViewModal,
  };
};

export default ForApprovalQuotationHooks;
