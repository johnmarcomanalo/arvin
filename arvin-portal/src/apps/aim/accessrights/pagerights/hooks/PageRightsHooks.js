import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import { cancelRequest } from "../../../../../api/api";
import {
  getEmployeePageAccessList,
  postEmployeePageAccess,
} from "../actions/PageRightsActions";
const PageRightsHooks = (props) => {
  const dispatch = useDispatch();
  const HRrefresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const search = useSelector((state) => state.HomeReducer.search);
  const page = useSelector((state) => state.HomeReducer.page);
  const rowsPerPage = useSelector((state) => state.HomeReducer.rowsPerPage);
  const dataList = useSelector(
    (state) => state.ReferenceReducer.search_reference_employee_page_access
  );
  const dataListCount = useSelector(
    (state) =>
      state.ReferenceReducer.search_reference_employee_page_access.length
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
  const columns = [
    { id: "module_description", label: "Module", align: "left" },
    { id: "component_description", label: "Component", align: "left" },
    { id: "sub_component_description", label: "Subcomponent", align: "left" },
    { id: "create", label: "Create", align: "left" },
    { id: "update", label: "Update", align: "left" },
    { id: "delete", label: "Delete", align: "left" },
    { id: "generate", label: "Generate", align: "left" },
    { id: "export", label: "Export", align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_HOME,
      data: {
        page: newPage,
      },
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_HOME,
      data: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const onSelectItem = (data) => {
    console.log(data);
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
  React.useEffect(() => {
    props.initialize({
      user_code: selectedDataList?.code,
      username: selectedDataList?.username,
      full_name: selectedDataList?.full_name,
    });
    return () => cancelRequest();
  }, [HRrefresh]);
  const onUpdateEmployeePageAccess = async (data, values) => {
    data["access_rights"] = values;
    data["user_id"] = selectedDataList?.code;
    data["added_by"] = account_details?.code;
    data["modified_by"] = account_details?.code;
    console.log(data);
    await dispatch(postEmployeePageAccess(data));
    await dispatch(getEmployeePageAccessList(selectedDataList?.code));
  };
  const handleAccessCheckType = async (event, type, data) => {
    let value = event.target.checked === true ? 1 : 0;
    data[type] = value;
    data["access_rights"] = data.access_rights;
    data["user_id"] = selectedDataList?.code;
    data["added_by"] = account_details?.code;
    data["modified_by"] = account_details?.code;
    await dispatch(postEmployeePageAccess(data));
    await dispatch(getEmployeePageAccessList(selectedDataList?.code));
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    dispatch({
      type: "search_reference_employee_page_access",
      data: search,
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
    onUpdateEmployeePageAccess,
    handleAccessCheckType,
    onChangeSearch,
  };
};

export default PageRightsHooks;
