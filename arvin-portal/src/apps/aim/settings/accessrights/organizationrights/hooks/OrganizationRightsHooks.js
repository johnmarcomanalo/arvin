import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getEmployeeOrganizationAccessList,
  postEmployeeOrganizationAccess,
} from "../actions/OrganizationRightsActions";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
const OrganizationRightsHooks = (props) => {
  const dispatch = useDispatch();
  const HRrefresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const search = useSelector((state) => state.HomeReducer.search);
  const page = useSelector((state) => state.HomeReducer.page);
  const rowsPerPage = useSelector((state) => state.HomeReducer.rowsPerPage);
  const dataList = useSelector(
    (state) =>
      state.ReferenceReducer.search_reference_employee_organization_access
  );
  const dataListCount = useSelector(
    (state) =>
      state.ReferenceReducer.search_reference_employee_organization_access.count
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
    { id: "company_description", label: "Company", align: "left" },
    { id: "business_unit_description", label: "Business Unit", align: "left" },
    { id: "team_description", label: "Team", align: "left" },
    { id: "department_description", label: "Department", align: "left" },
    { id: "section_description", label: "Section", align: "left" },
    { id: "subsection_description", label: "Subsection", align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_HOME,
      payload: {
        page: newPage,
      },
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
  const onUpdateEmployeeOrganizationAccess = async (data, values) => {
    data["access_rights"] = values;
    data["user_id"] = selectedDataList?.code;
    data["added_by"] = account_details?.code;
    data["modified_by"] = account_details?.code;
    await dispatch(postEmployeeOrganizationAccess(data));
    await dispatch(getEmployeeOrganizationAccessList(selectedDataList?.code));
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    dispatch({
      type: "search_reference_employee_organization_access",
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
    onUpdateEmployeeOrganizationAccess,
    onChangeSearch,
  };
};

export default OrganizationRightsHooks;
