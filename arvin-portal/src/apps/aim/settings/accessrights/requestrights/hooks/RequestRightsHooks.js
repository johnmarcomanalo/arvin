import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getRequestTypeRightsAccessList,
  // postEmployeeCustomerAccess,
} from "../actions/RequestRightsActions";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
const RequestRightsHooks = (props) => {
  const dispatch = useDispatch();
  const HRrefresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const dataList = useSelector(
    (state) => state.ReferenceReducer.search_reference_request_type_page_access
  );
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const dateFilterStart = useSelector(
    (state) => state.HumanResourceReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector(
    (state) => state.HumanResourceReducer.dateFilterEnd
  );
  const selectedDataList = useSelector(
    (state) => state.HumanResourceReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const viewModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
  const updateModal = useSelector(
    (state) => state.ReferenceReducer.updateModal
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("pg") != null ? searchParams.get("pg") : 1;
  const rowsPerPage =
    searchParams.get("lmt") != null ? searchParams.get("lmt") : 10;
  const search =
    searchParams.get("srch") != null ? String(searchParams.get("srch")) : "";
  const filterQuery =
    searchParams.get("fltr") != null ? String(searchParams.get("fltr")) : "";
  const uid = searchParams.get("uid") != null ? selectedDataList.code : null;
  const debounceSearch = useDebounce(searchParams, 500);

  const columns = [
    { id: "request_type_description", label: "Request Type", align: "left" },
    {
      id: "request_hierarchy_description",
      label: "Hierarchy Description",
      align: "left",
    },
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
  const GetUserRequestAccessList = async () => {
    try {
      const data = getListParam();
      await dispatch(getRequestTypeRightsAccessList(data));
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    if (selectedDataList !== null) {
      GetUserRequestAccessList();
    }
  }, [HRrefresh, refresh, debounceSearch, filterQuery]);
  React.useEffect(() => {
    props.initialize({
      user_code: selectedDataList?.code,
      username: selectedDataList?.username,
      full_name: selectedDataList?.full_name,
    });
    return () => cancelRequest();
  }, [HRrefresh]);

  const onUpdateEmployeeRequestAccess = async (data, values) => {
    const details = getListParam();
    data["access_rights"] = values;
    data["user_id"] = selectedDataList?.code;
    data["added_by"] = account_details?.code;
    data["modified_by"] = account_details?.code;
    // await dispatch(postEmployeeCustomerAccess(data));
    await dispatch(getRequestTypeRightsAccessList(details));
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

  const onClickOpenUpdateModal = (row) => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        updateModal: true,
        selected_ref: row,
      },
    });
  };
  const onClickCloseUpdateModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        updateModal: false,
      },
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
    updateModal,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onUpdateEmployeeRequestAccess,
    onChangeSearch,
    onClickOpenUpdateModal,
    onClickCloseUpdateModal,
  };
};

export default RequestRightsHooks;
