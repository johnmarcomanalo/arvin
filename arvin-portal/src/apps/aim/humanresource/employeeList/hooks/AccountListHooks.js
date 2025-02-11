import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getEmployeeCustomerAccessList } from "../../../settings/accessrights/customerrights/actions/CustomerRightsActions";
import { getEmployeeOrganizationAccessList } from "../../../settings/accessrights/organizationrights/actions/OrganizationRightsActions";
import { getEmployeePageAccessList } from "../../../settings/accessrights/pagerights/actions/PageRightsActions";
import { getAccountList } from "../actions/AccountListActions";
const AccountListHooks = (props) => {
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

  //second search param start
  const search2 =
    searchParams.get("srch") != null ? String(searchParams.get("srch")) : "";
  const page2 = searchParams.get("pg") != null ? searchParams.get("pg") : 1;
  const rowsPerPage2 =
    searchParams.get("lmt") != null ? searchParams.get("lmt") : 10;
  const filterQuery2 =
    searchParams.get("fltr") != null ? String(searchParams.get("fltr")) : "";
  //second search param end

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
  const columns = [
    { id: "code", label: "Account Code", align: "left" },
    { id: "full_name", label: "Complete Name", align: "left" },
    { id: "username", label: "Username", align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    setSearchParams({
      p: newPage,
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
    const data2 = getListParam2();
    await dispatch(getEmployeeOrganizationAccessList(data.code));
    await dispatch(getEmployeePageAccessList(data.code));
    await dispatch(getEmployeeCustomerAccessList(data2));
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
      payloads: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payloads: {
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

  const getListParam2 = () => {
    const data = {
      pg: page2 == null ? 1 : page,
      srch: search2,
      lmt: rowsPerPage2,
      fltr: filterQuery2,
      uid: account_details?.code,
    };
    return data;
  };
  const GetAccountLists = async () => {
    try {
      const data = getListParam();
      await dispatch(getAccountList(data));
    } catch (error) {
      await console.error(error);
    }
  };
  useEffect(() => {
    GetAccountLists();
  }, [refresh, debounceSearch, filterQuery]);
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
    onChangeSearch,
  };
};

export default AccountListHooks;
