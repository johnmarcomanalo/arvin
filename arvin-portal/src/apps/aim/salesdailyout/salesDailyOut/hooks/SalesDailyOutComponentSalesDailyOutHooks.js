import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getAnnualMonthlyDailyTargetSalesBySectionSubsection } from "../../annualSettingSale/actions/SalesDailyOutComponentAnnualSettingSaleActions";
import {
  getSalesDailyOut,
  getStatusDailyTargetAndPercentageDailyTargetByDailyOut,
} from "../actions/SalesDailyOutComponentSalesDailyOutActions";
const SalesDailyOutComponentSalesDailyOutHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    year: moment(new Date()).format("YYYY"),
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != undefined ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null
      ? String(searchParams.get("f"))
      : moment(new Date()).format("YYYY-MM-DD");
  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const present_mtd_data = useSelector(
    (state) => state.SalesDailyOutReducer.present_mtd_data
  );
  const previous_mtd_data = useSelector(
    (state) => state.SalesDailyOutReducer.previous_mtd_data
  );
  const report_data = useSelector(
    (state) => state.SalesDailyOutReducer.report_data
  );
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

  const annual_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_target
  );

  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );

  const daily_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.daily_sales_target
  );

  const columns = [
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
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        dateFilter: selected_date,
      },
    });
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
  const GetSalesDailyOut = () => {
    try {
      const data = getListParam();
      dispatch(getSalesDailyOut(data));
    } catch (error) {
      console.error(error);
    }
  };
  const GetAnnualMonthlyDailyTargetSalesBySectionSubsection = () => {
    try {
      dispatch(
        getAnnualMonthlyDailyTargetSalesBySectionSubsection(
          account_details?.subsection_code,
          moment(filterQuery).format("YYYY")
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection();
  }, []);
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
    report_data,
    annual_sales_target,
    monthly_sales_target,
    daily_sales_target,
    present_mtd_data,
    previous_mtd_data,

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
