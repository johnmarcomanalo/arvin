import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { encryptLocal } from "../../../../../utils/Encryption";
import { useDebounce } from "../../../../../utils/HelperUtils";
import moment from "moment";
import {
  getAnnualSettingSale,
  getMonthlyAndDailyQoutaByTargetAnnualSales,
} from "../actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
import { cancelRequest } from "../../../../../api/api";
const QuotationComponentAnnualQuotaHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    ranking_placement: [{ index: 1, description: "", value: 0 }],
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
  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
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

  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "year_sales_target", label: "Year", align: "left" },
    { id: "section", label: "Section", align: "left" },
    { id: "subsection", label: "Subsection", align: "left" },
    { id: "annual_sales_target", label: "Annual Quota", align: "left" },
    { id: "monthly_sales_target", label: "Monthly Quota", align: "left" },
    { id: "daily_sales_target", label: "Daily Quota", align: "left" },
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
    });
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const GetMonthlyAndDailyQoutaByAnnualQouta = async (e) => {
    try {
      let { value } = e.target;
      if (value > 0) {
        await debounce(() => {
          dispatch(getMonthlyAndDailyQoutaByTargetAnnualSales(value));
        }, state.debounceDelay);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      u: account_details?.id,
    };
    return data;
  };

  const GetAnnualSettingSaleList = async () => {
    try {
      const data = getListParam();
      await dispatch(getAnnualSettingSale(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetAnnualSettingSaleList();
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
          description: "",
          value: 0,
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

    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    GetMonthlyAndDailyQoutaByAnnualQouta,
    onChangeRankingPlacement,
    onClickAddRankingPlacement,
    onClickRemoveRankingPlacement,
  };
};

export default QuotationComponentAnnualQuotaHooks;
