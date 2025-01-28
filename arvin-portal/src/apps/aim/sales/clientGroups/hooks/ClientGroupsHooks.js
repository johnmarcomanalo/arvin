import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getClientGroups } from "../actions/ClientGroupsActions";
const ClientGroupsHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const refresh2 = useSelector((state) => state.SalesDailyOutReducer.refresh2);
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const viewModal = useSelector((state) => state.ReferenceReducer.viewModal);

  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null
      ? String(searchParams.get("f"))
      : moment(new Date()).format("MM");

  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();

  const columns = [
    { id: "code", label: "Ranking", align: "left" },
    { id: "description", label: "Description", align: "left" },
  ];

  const columns2 = [
    { id: "description", label: "Month", align: "left" },
    { id: "placement", label: "Placement", align: "left" },
    { id: "value", label: "Points", align: "left" },
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
      q: search,
      p: page,
      l: String(rowsPerPage),
      f: filterQuery,
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
  const onSelectItem = (data) => {
    console.log(data);
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
    });
  };
  const onChangeFilter = (event) => {
    // SEARCH DATA
    const filter = event.target.value;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filter,
    });
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
    };
    return data;
  };

  const GetClientGroups = async () => {
    try {
      const data = getListParam();
      await dispatch(getClientGroups(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetClientGroups();
    return () => cancelRequest();
  }, [refresh, filterQuery, search]);

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
    columns2,
    filterQuery,
    viewModal,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onChangeSearch,
    onClickOpenAddModal,
    onChangeFilter,
    onClickOpenCloseModal,
  };
};

export default ClientGroupsHooks;
