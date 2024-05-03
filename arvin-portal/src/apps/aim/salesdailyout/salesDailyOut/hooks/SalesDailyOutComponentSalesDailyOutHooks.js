import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import cancelRequest from "../../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal } from "../../../../../utils/Encryption";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getAnnualMonthlyDailyTargetSalesBySectionSubsection } from "../../annualSettingSale/actions/SalesDailyOutComponentAnnualSettingSaleActions";
import {
  getSalesDailyOut,
  getStatusDailyTargetAndPercentageDailyTargetByDailyOut,
} from "../actions/SalesDailyOutComponentSalesDailyOutActions";
import moment from "moment";
const SalesDailyOutComponentSalesDailyOutHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "";
  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end
  const getListParam = () => {
    // const page = page;
    const search = search;
    const filter = filterQuery;
    const data = {
      page: page == null ? 1 : page,
      search: search == null ? "" : search,
      limit: rowsPerPage,
      filter: filter,
    };
    return data;
  };

  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount
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
    { id: "sales_date", label: "Date", align: "left" },
    { id: "sales_daily_qouta", label: "Daily Quota", align: "left" },
    { id: "sales_daily_out", label: "Daily Out", align: "left" },
    {
      id: "sales_daily_target",
      label: "Status Daily Target",
      align: "left",
    },
    {
      id: "daily_sales_target_percentage",
      label: "Percent Daily Target",
      align: "left",
    },
    { id: "status", label: "Status", align: "left" },
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
  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        page: newPage,
      },
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        rowsPerPage: event.target.value,
        page: 0,
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
  const GetAnnualMonthlyDailyTargetSalesBySectionSubsection = async (
    type,
    value,
    year
  ) => {
    try {
      await debounce(() => {
        dispatch(
          getAnnualMonthlyDailyTargetSalesBySectionSubsection(type, value, year)
        );
      }, state.debounceDelay);
    } catch (error) {
      console.error(error);
    }
  };
  const GetStatusDailyTargetAndPercentageDailyTargetByDailyOut = async (
    daily_out,
    daily_quota
  ) => {
    try {
      await debounce(() => {
        dispatch(
          getStatusDailyTargetAndPercentageDailyTargetByDailyOut(
            daily_out,
            daily_quota
          )
        );
      }, state.debounceDelay);
    } catch (error) {
      console.error(error);
    }
  };
  const filterMonthAndYear = (date) => {
    let selected_date = moment(date).format("YYYY-MM");
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: selected_date,
    });
  };
  const GetSalesDailyOut = () => {
    try {
      const data = {
        p: page,
        l: rowsPerPage,
        q: search,
        f: filterQuery,
        u: account_details?.id,
      };
      dispatch(getSalesDailyOut(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetSalesDailyOut();
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
    addModal,

    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection,
    GetStatusDailyTargetAndPercentageDailyTargetByDailyOut,
    GetSalesDailyOut,
    filterMonthAndYear,
  };
};

export default SalesDailyOutComponentSalesDailyOutHooks;
