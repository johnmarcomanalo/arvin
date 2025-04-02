import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getRefClientGroups } from "../actions/ClientGroupsActions";
import { getClientSubGroups } from "../actions/ClientSubgroupsActions";
const ClientGroupsListHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const viewModal = useSelector(
    (state) => state.SalesDailyOutReducer.viewModal
  );

  const dataList = useSelector((state) => state.ReferenceReducer.client_groups);
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.client_groups_count
  );

  const dataSubList = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubList
  );
  const dataSubListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page =
    searchParams.get("ref_client_groups_page") != null
      ? searchParams.get("ref_client_groups_page")
      : 1;
  const rowsPerPage =
    searchParams.get("ref_client_groups_limit") != null
      ? searchParams.get("ref_client_groups_limit")
      : 10;
  const search =
    searchParams.get("ref_client_groups_search") != null
      ? String(searchParams.get("ref_client_groups_search"))
      : "";
  const filterQuery =
    searchParams.get("ref_client_groups_filter") != null
      ? String(searchParams.get("ref_client_groups_filter"))
      : "";

  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();

  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "type", label: "Type", align: "left" },
    { id: "subtype", label: "Warehouse", align: "left" },
  ];

  const subcolumns = [
    { id: "customer_code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "type", label: "Type", align: "left" },
  ];

  const type = [
    { description: "Manila Branch" },
    { description: "Provincial" },
    { description: "Peanut" },
  ];

  const selected_code = useSelector(
    (state) => state.SalesDailyOutReducer.selected_code
  );

  const onClickOpenAddModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: true,
      },
    });
  };
  const onClickOpenCloseModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: false,
      },
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      ref_client_groups_search: search,
      ref_client_groups_page: page,
      ref_client_groups_limit: String(rowsPerPage),
      ref_client_groups_filter: filterQuery,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const onSelectItem = async (data) => {
    await dispatch(getClientSubGroups(data.code));
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        selectedDataList: data,
        viewModal: true,
      },
    });
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      ref_client_groups_search: search,
      ref_client_groups_page: "1",
      ref_client_groups_limit: String(rowsPerPage),
      ref_client_groups_filter: filterQuery,
    });
  };
  const onChangeFilter = (filter) => {
    // SEARCH DATA
    setSearchParams({
      ref_client_groups_search: search,
      ref_client_groups_page: "1",
      ref_client_groups_limit: String(rowsPerPage),
      ref_client_groups_filter: filter,
    });
  };
  const getListParam = () => {
    const data = {
      ref_client_groups_search: search,
      ref_client_groups_page: page == null ? 1 : page,
      ref_client_groups_limit: rowsPerPage,
      ref_client_groups_filter: filterQuery,
    };
    return data;
  };

  const GetClientGroups = async () => {
    try {
      const data = getListParam();
      await dispatch(getRefClientGroups(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (filterQuery != "") {
      GetClientGroups();
    }
    return () => cancelRequest();
  }, [refresh, filterQuery, search, page]);
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        viewModal: false,
      },
    });
  };
  return {
    search,
    page,
    dataList,
    rowsPerPage,
    dataListCount,
    columns,
    addModal,
    selected_code,
    account_details,
    subcolumns,
    filterQuery,
    viewModal,
    dataSubList,
    dataListCount,
    selectedDataList,
    type,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onChangeSearch,
    onClickOpenAddModal,
    onChangeFilter,
    onClickOpenCloseModal,
    onClickCloseViewModal,
  };
};

export default ClientGroupsListHooks;
