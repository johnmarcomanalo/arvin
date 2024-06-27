import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import { React, useEffect } from "react";
import { getEmployeeList } from "../actions/EmployeeListActions";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getEmployeeOrganizationAccessList } from "../../../accessrights/organizationrights/actions/OrganizationRightsActions";
const EmployeeListHooks = (props) => {
  const refresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "";

  const debounceSearch = useDebounce(searchParams, 500);

  const searchdataList = useSelector(
    (state) => state.HumanResourceReducer.searchdataList
  );
  const searchdataListCount = useSelector(
    (state) => state.HumanResourceReducer.searchdataListCount
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
  const columns = [
    { id: "code", label: "User Code", align: "left" },
    { id: "full_name", label: "Complete Name", align: "left" },
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
  const onSelectItem = async (data) => {
    await dispatch(getEmployeeOrganizationAccessList(data.code));
    await dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        selectedDataList: data,
        refresh: !refresh,
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
      data: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      data: {
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
      await dispatch(getEmployeeList(data));
    } catch (error) {
      await console.error(error);
    }
  };
  useEffect(() => {
    GetEmployeeLists();
  }, [refresh, debounceSearch, filterQuery]);
  return {
    search,
    page,
    searchdataList,
    rowsPerPage,
    searchdataListCount,
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
    onChangeSearch,
  };
};

export default EmployeeListHooks;
