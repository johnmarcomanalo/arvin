import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import {
  getAnnualSettingSaleRanking,
  getReferenceSalesRankingPlacements,
} from "../actions/SalesRankingPointsActions";
const SalesRankingPointsHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    ranking_placement: [{ index: 1 }],
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
      : moment(new Date()).format("YYYY");
  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const addModal2 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal2
  );
  const addModal3 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal3
  );
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const dataSubList = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubList
  );
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const dateFilterStart = useSelector(
    (state) => state.SalesDailyOutReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector(
    (state) => state.SalesDailyOutReducer.dateFilterEnd
  );
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const sales_ranking_placements = useSelector(
    (state) => state.ReferenceReducer.sales_ranking_placements
  );
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "value", label: "Points", align: "left" },
    { id: "type", label: "Type", align: "left" },
  ];

  const subcolumns = [
    { id: "description", label: "Description", align: "left" },
    { id: "value", label: "Points", align: "left" },
  ];
  const onClickOpenAddModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: true,
      },
    });
  };
  const onClickCloseAddModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: false,
      },
    });
  };
  const onClickCloseAddModal2 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal2: false,
      },
    });
  };
  const onClickCloseAddModal3 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal3: false,
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
  const onSelectItem = async (data) => {
    await dispatch(getReferenceSalesRankingPlacements(data.code));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        selectedDataList: data,
        addModal2: true,
      },
    });
  };
  const onSelectItemtoUpdate = async (data) => {
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        selectedDataList: data,
        addModal3: true,
      },
    });
    await dispatch(getReferenceSalesRankingPlacements(data.code));
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onChangeSearch = async (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
    });
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
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

  const GetAnnualSettingSaleRankingList = async () => {
    try {
      const data = getListParam();
      await dispatch(getAnnualSettingSaleRanking(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetAnnualSettingSaleRankingList();
    return () => cancelRequest();
  }, [refresh, filterQuery, search]);

  const onChangeRankingPlacement = (event, index) => {
    let valu = event.target.value;
    let name = event.target.name;
    setState((prev) => ({
      ...prev,
      ranking_placement: state.ranking_placement.map((val, index2) =>
        index === index2 ? { ...val, [name]: valu } : val
      ),
    }));
  };

  const onClickAddRankingPlacement = () => {
    let placement = {
      index: state.ranking_placement.length + 1,
    };
    state.ranking_placement.push(placement);
    setState((prev) => ({
      ...prev,
    }));
  };
  const onClickRemoveRankingPlacement = () => {
    state.ranking_placement.splice(state.ranking_placement.length - 1, 1);
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
    dateFilterStart,
    dateFilterEnd,
    selectedDataList,
    columns,
    addModal,
    account_details,
    addModal2,
    dataSubList,
    subcolumns,
    addModal3,
    sales_ranking_placements,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    onChangeRankingPlacement,
    onClickAddRankingPlacement,
    onClickRemoveRankingPlacement,
    onClickCloseAddModal2,
    onSelectItemtoUpdate,
    onClickCloseAddModal3,
  };
};

export default SalesRankingPointsHooks;
