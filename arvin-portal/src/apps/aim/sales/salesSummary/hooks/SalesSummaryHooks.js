import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import {
  getSalesSummaryData,
  getReferenceSalesRankingPlacements,
} from "../actions/SalesSummaryActions";
import { ViewAmountFormatingDecimals } from "../../../../../utils/AccountingUtils";
const SalesSummaryHooks = (props) => {
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
  const filter_id =
    searchParams.get("id") != null ? searchParams.get("id") : "";
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
  const showTableCards = useSelector(
    (state) => state.SalesDailyOutReducer.showTableCards
  );
  const annual_sales_mtd_ytd_subsections = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_mtd_ytd_subsections
  );
  const annual_sales_out_summary = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_out_summary
  );
  const current_sales_mtd_ytd_subsections = useSelector(
    (state) => state.SalesDailyOutReducer.current_sales_mtd_ytd_subsections
  );
  const yearly_sales_line_chart_summary = useSelector(
    (state) => state.SalesDailyOutReducer.yearly_sales_line_chart_summary
  );
  const total_daily_out_amount = useSelector(
    (state) => state.SalesDailyOutReducer.total_daily_out_amount
  );
  const showMTDTable = useSelector(
    (state) => state.SalesDailyOutReducer.showMTDTable
  );
  const showYTDTable = useSelector(
    (state) => state.SalesDailyOutReducer.showYTDTable
  );
  const annual_set_total_count_subsections = useSelector(
    (state) => state.SalesDailyOutReducer.annual_set_total_count_subsections
  );
  const annual_set_subsections = useSelector(
    (state) => state.SalesDailyOutReducer.annual_set_subsections
  );
  const columns = [
    { id: "description", label: "Description", align: "left" },
    { id: "january", label: "January", align: "left" },
    { id: "february", label: "February", align: "left" },
    { id: "march", label: "March", align: "left" },
    { id: "april", label: "April", align: "left" },
    { id: "may", label: "May", align: "left" },
    { id: "june", label: "June", align: "left" },
    { id: "july", label: "July", align: "left" },
    { id: "august", label: "August", align: "left" },
    { id: "september", label: "September", align: "left" },
    { id: "october", label: "October", align: "left" },
    { id: "november", label: "November", align: "left" },
    { id: "december", label: "December", align: "left" },
    {
      id: "total",
      label: "Total",
      align: "left",
      format: (value) => ViewAmountFormatingDecimals(value, 2),
    },
  ];

  const subcolumns = [
    { id: "description", label: "Description", align: "left" },
    { id: "value", label: "Points", align: "left" },
  ];

  const current_sales_mtd_ytd_subsections_columns = [
    { id: "subsection", label: "Subsection", align: "left" },
    { id: "current_mtd", label: "Current MTD", align: "left" },
    { id: "current_ytd", label: "Current YTD", align: "left" },
  ];
  const annual_sales_mtd_ytd_subsections_columns = [
    { label: "Description" },
    { label: "January" },
    { label: "February" },
    { label: "March" },
    { label: "April" },
    { label: "May" },
    { label: "June" },
    { label: "July" },
    { label: "August" },
    { label: "September" },
    { label: "October" },
    { label: "November" },
    { label: "December" },
  ];
  const annual_sales_mtd_ytd_subsections_subcolumns = [
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
    { label: "MTD" },
    { label: "YTD" },
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
      id: filter_id,
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
    console.log(data);
  };
  const onSelectItemtoUpdate = async (data) => {
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        selectedDataList: data,
        addModal3: true,
      },
    });
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onChangeSearch = async (type) => {
    // SEARCH DATA
    const search = type;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
      id: filter_id,
    });
  };
  const onChangeSubsectionCode = async (code) => {
    // SEARCH DATA
    const filter_id = code;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
      id: filter_id,
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
      id: filter_id,
    };
    return data;
  };

  const GetSalesSummary = async () => {
    try {
      const data = getListParam();
      await dispatch(getSalesSummaryData(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetSalesSummary();
    return () => cancelRequest();
  }, [refresh, filterQuery, search, filter_id]);

  const onClickShowMTDTable = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        showMTDTable: true,
        showYTDTable: false,
      },
    });
  };
  const onClickShowYTDTable = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        showMTDTable: false,
        showYTDTable: true,
      },
    });
  };
  const onClickShowTableSummary = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        showTableCards: false,
      },
    });
  };
  const onClickShowTableCardsSummary = (event) => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        showTableCards: true,
      },
    });
  };
  const onChangeFilter = (date) => {
    // SEARCH DATA
    const filterQuery = date;
    setSearchParams({
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      id: filter_id,
    });
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
    showTableCards,
    current_sales_mtd_ytd_subsections_columns,
    annual_sales_mtd_ytd_subsections_columns,
    annual_sales_mtd_ytd_subsections_subcolumns,
    annual_sales_mtd_ytd_subsections,
    annual_sales_out_summary,
    current_sales_mtd_ytd_subsections,
    yearly_sales_line_chart_summary,
    total_daily_out_amount,
    showMTDTable,
    showYTDTable,
    annual_set_total_count_subsections,
    annual_set_subsections,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    onClickCloseAddModal2,
    onSelectItemtoUpdate,
    onClickCloseAddModal3,
    onClickShowTableSummary,
    onClickShowTableCardsSummary,
    onClickShowMTDTable,
    onClickShowYTDTable,
    onChangeFilter,
    onChangeSubsectionCode,
  };
};

export default SalesSummaryHooks;
