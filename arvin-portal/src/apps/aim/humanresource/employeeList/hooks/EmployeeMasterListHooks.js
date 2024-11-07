import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import { React, useEffect } from "react";
import {
  getEmployeeList,
  getUserEmployeeList,
} from "../actions/EmployeeListActions";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getEmployeeOrganizationAccessList } from "../../../settings/accessrights/organizationrights/actions/OrganizationRightsActions";
import { getEmployeePageAccessList } from "../../../settings/accessrights/pagerights/actions/PageRightsActions";
import { getEmployeeCustomerAccessList } from "../../../settings/accessrights/customerrights/actions/CustomerRightsActions";
const EmployeeMasterListHooks = (props) => {
  const navigate = useNavigate();
  const refresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams2, setSearchParams2] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";

  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "";

  const debounceSearch = useDebounce(searchParams, 500);

  const dataList = useSelector((state) => state.HumanResourceReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.HumanResourceReducer.dataListCount
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
  const uploadModal = useSelector(
    (state) => state.HumanResourceReducer.uploadModal
  );
  const addModal = useSelector((state) => state.HumanResourceReducer.addModal);
  const columns = [
    { id: "code", label: "User Code", align: "left" },
    { id: "full_name", label: "Complete Name", align: "left" },
    { id: "position", label: "Position", align: "left" },
  ];

  const handleChangePage = (event, page) => {
    setSearchParams({
      p: page,
      q: search,
      l: String(rowsPerPage),
      f: filterQuery,
      u: account_details?.code,
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
    await navigate("/Modules/HumanResource/Employee/EmployeeDetails");
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
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      p: "1",
      q: search,
      l: String(rowsPerPage),
      f: filterQuery,
      u: account_details?.code,
    });
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      u: account_details?.code,
    };
    return data;
  };

  const GetEmployeeLists = async () => {
    try {
      const data = getListParam();
      await dispatch(getUserEmployeeList(data));
    } catch (error) {
      await console.error(error);
    }
  };
  useEffect(() => {
    GetEmployeeLists();
  }, [refresh, debounceSearch, filterQuery]);

  const onClickOpenUploadModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        uploadModal: true,
      },
    });
  };
  const onClickCloseUploadModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        uploadModal: false,
      },
    });
  };
  const onClickOpenAddModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        addModal: true,
      },
    });
  };
  const onClickCloseAddModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        addModal: false,
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
    uploadModal,
    addModal,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeSearch,
    onClickOpenUploadModal,
    onClickCloseUploadModal,
    onClickOpenAddModal,
    onClickCloseAddModal,
  };
};

export default EmployeeMasterListHooks;
