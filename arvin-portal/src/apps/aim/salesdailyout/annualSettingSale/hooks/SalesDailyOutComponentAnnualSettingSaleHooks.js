import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { encryptLocal } from "../../../../../utils/Encryption";
import { useDebounce } from "../../../../../utils/HelperUtils";
import {
  getAnnualSettingSale,
  monthlyAndDailyQoutaByTargetAnnualSales,
} from "../actions/SalesDailyOutComponentAnnualSettingSaleActions";
import { cancelRequest } from "../../../../../api/api";
const QuotationComponentAnnualQuotaHooks = (props) => {
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
    searchParams.get("f") != null
      ? String(searchParams.get("f"))
      : encryptLocal([]);
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
          dispatch(monthlyAndDailyQoutaByTargetAnnualSales(value));
        }, state.debounceDelay);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const GetAnnualSettingSaleList = async () => {
    try {
      await dispatch(getAnnualSettingSale());
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    GetAnnualSettingSaleList();
    return () => cancelRequest();
  }, [refresh]);
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
    GetMonthlyAndDailyQoutaByAnnualQouta,
  };
};

export default QuotationComponentAnnualQuotaHooks;
