import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getEmployeeCustomerAccessList,
  postEmployeeCustomerAccess,
} from "../actions/CustomerRightsActions";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
const CustomerRightsHooks = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 500,
  });
  const HRrefresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const dataList = useSelector(
    (state) => state.ReferenceReducer.search_reference_customer_page_access
  );
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const dateFilterStart = useSelector(
    (state) => state.HomeReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector((state) => state.HomeReducer.dateFilterEnd);
  const selectedDataList = useSelector(
    (state) => state.HumanResourceReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const viewModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("pg") != null ? searchParams.get("pg") : 1;
  const rowsPerPage =
    searchParams.get("lmt") != null ? searchParams.get("lmt") : 10;
  const search =
    searchParams.get("srch") != null ? String(searchParams.get("srch")) : "";
  const filterQuery =
    searchParams.get("fltr") != null ? String(searchParams.get("fltr")) : "";
  const uid = searchParams.get("uid") != null ? account_details.code : null;
  const debounceSearch = useDebounce(searchParams, 500);

  const columns = [
    { id: "customer_code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "type", label: "Type", align: "left" },
    { id: "status", label: "Status", align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    setSearchParams({
      pg: page == null ? 1 : newPage,
      srch: search,
      lmt: rowsPerPage,
      fltr: filterQuery,
      uid: selectedDataList?.code,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_HOME,
      payload: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const onSelectItem = async (data) => {
    await dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        selectedDataList: data,
        refresh: !HRrefresh,
        viewModal: false,
      },
    });
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: false,
      },
    });
  };
  const getListParam = () => {
    const data = {
      pg: page == null ? 1 : page,
      srch: search,
      lmt: rowsPerPage,
      fltr: filterQuery,
      uid: selectedDataList?.code,
    };
    return data;
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const GetCustomerList = async () => {
    try {
      const data = getListParam();
      await debounce(() => {
        dispatch(getEmployeeCustomerAccessList(data));
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    if (selectedDataList !== null) {
      GetCustomerList();
    }
  }, [HRrefresh, debounceSearch, filterQuery]);
  React.useEffect(() => {
    props.initialize({
      user_code: selectedDataList?.code,
      username: selectedDataList?.username,
      full_name: selectedDataList?.full_name,
    });
    return () => cancelRequest();
  }, [HRrefresh]);

  const onUpdateEmployeeCustomerAccess = async (data, values) => {
    const details = getListParam();
    data["access_rights"] = values;
    data["user_id"] = selectedDataList?.code;
    data["added_by"] = account_details?.code;
    data["modified_by"] = account_details?.code;
    await dispatch(postEmployeeCustomerAccess(data));
    await dispatch(getEmployeeCustomerAccessList(details));
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      srch: search,
      pg: "1",
      lmt: String(rowsPerPage),
      fltr: filterQuery,
      uid: selectedDataList?.code,
    });
  };
  return {
    search,
    page,
    dataList,
    rowsPerPage,
    dataListCount,
    dateFilterStart,
    dateFilterEnd,
    selectedDataList,
    columns,
    account_details,
    viewModal,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onUpdateEmployeeCustomerAccess,
    onChangeSearch,
  };
};

export default CustomerRightsHooks;
