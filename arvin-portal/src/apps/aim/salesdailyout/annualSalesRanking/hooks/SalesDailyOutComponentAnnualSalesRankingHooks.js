import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { encryptLocal } from "../../../../../utils/Encryption";
import { useDebounce } from "../../../../../utils/HelperUtils";
import moment from "moment";
import { getRefSalesRanking } from "../../../reference/actions/ReferenceActions";
import {
  getAnnualSalesRanking,
  getMonthlyAndDailyQoutaByTargetAnnualSales,
} from "../actions/SalesDailyOutComponentAnnualSalesRankingActions";
import { cancelRequest } from "../../../../../api/api";
import { getReferenceSalesRankingPlacements } from "../../annualSettingSalesRanking/actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
import { decryptaes } from "../../../../../utils/LightSecurity";
const SalesDailyOutComponentAnnualSalesRankingHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const refresh2 = useSelector((state) => state.SalesDailyOutReducer.refresh2);
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const addModal2 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal2
  );
  const addModal3 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal3
  );
  const addModal4 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal4
  );
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
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
  const target_point = useSelector(
    (state) => state.SalesDailyOutReducer.target_point
  );
  const sales_ranking_placements = useSelector(
    (state) => state.ReferenceReducer.sales_ranking_placements
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
  const uid = searchParams.get("uid") != null ? account_details.code : null;

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

  const onClickOpenAddModal2 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal2: true,
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
  const onClickCloseAddModal4 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal4: false,
      },
    });
  };
  const onClickRefreshRanking = async () => {
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !refresh,
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
      rc: selected_code,
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
  const onDeleteDeduction = (data) => {
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
      rc: selected_code,
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
      rc: selected_code,
    });
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      u: account_details?.code,
      rc: selected_code,
    };
    return data;
  };

  const GenerateAnnualSalesRanking = async () => {
    try {
      const data = getListParam();
      await dispatch(getAnnualSalesRanking(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (selected_code !== null) {
      GenerateAnnualSalesRanking();
    }
    return () => cancelRequest();
  }, [refresh, filterQuery, search, selected_code]);

  const onClickSelectedDataList = async (data, modal) => {
    await dispatch(getReferenceSalesRankingPlacements(data.rank_code));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        selectedDataList: data,
        [modal]: true,
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
    addModal,
    addModal2,
    selected_code,
    account_details,
    target_point,
    addModal3,
    sales_ranking_placements,
    addModal4,
    columns2,
    filterQuery,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    onClickOpenAddModal2,
    onClickCloseAddModal2,
    onClickSelectedDataList,
    onClickCloseAddModal3,
    onClickCloseAddModal4,
    onClickRefreshRanking,
    onChangeFilter,
  };
};

export default SalesDailyOutComponentAnnualSalesRankingHooks;
