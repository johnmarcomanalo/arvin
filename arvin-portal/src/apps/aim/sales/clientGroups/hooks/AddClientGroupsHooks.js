import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import swal from "sweetalert";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
const AddClientGroupsHooks = (props) => {
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
    sub_group: [],
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
    { id: "ranker_code", label: "Ranker", align: "left" },
    { id: "current_point", label: "Point", align: "left" },
  ];

  const columns2 = [
    { id: "description", label: "Month", align: "left" },
    { id: "placement", label: "Placement", align: "left" },
    { id: "value", label: "Points", align: "left" },
  ];
  const selected_code = useSelector(
    (state) => state.SalesDailyOutReducer.selected_code
  );

  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal: false,
      },
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      q: search,
      p: page,
      l: String(rowsPerPage),
      f: filterQuery,
      u: account_details?.code,
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
      u: account_details?.code,
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

  const GetClientGroups = async () => {
    try {
      //   await dispatch(getAnnualSalesRanking(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetClientGroups();
    return () => cancelRequest();
  }, [refresh, filterQuery, search]);

  React.useEffect(() => {
    props.initialize({
      added_by: account_details?.code,
      modified_by: account_details?.code,
    });
    return () => cancelRequest();
  }, []);
  const onClickSelectClientList = (data) => {
    let client = {
      customer_code: data.customer_code,
      description: data.description,
      type: data.type,
      status: data.status,
    };
    // Check if the customer_code already exists in the sub_group
    const isUnique = !state.sub_group.some(
      (item) => item.customer_code === client.customer_code
    );

    if (isUnique) {
      state.sub_group.push(client);
      setState((prev) => ({
        ...prev,
      }));
      swal("Success", "Client added successfully", "success");
    } else {
      swal("Error", "Client already exists", "error");
    }
  };
  const onClickRemoveClientList = () => {
    state.sub_group.splice(state.sub_group.length - 1, 1);
    setState((prev) => ({
      ...prev,
    }));
  };
  return {
    state,
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
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeFilter,
    onClickSelectClientList,
    onClickRemoveClientList,
  };
};

export default AddClientGroupsHooks;
