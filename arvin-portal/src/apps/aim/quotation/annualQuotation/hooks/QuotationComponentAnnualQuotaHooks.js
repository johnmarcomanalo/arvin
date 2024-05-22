import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { encryptLocal } from "../../../../../utils/Encryption";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { monthlyAndDailyQoutaByAnnualQouta } from "../actions/QuotationComponentAnnualQuotaActions";
const QuotationComponentAnnualQuotaHooks = (props) => {
  const refresh = useSelector((state) => state.QuotationReducer.refresh);
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
  const addModal = useSelector((state) => state.QuotationReducer.addModal);
  const dataList = useSelector((state) => state.QuotationReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.QuotationReducer.dataListCount
  );

  const dateFilterStart = useSelector(
    (state) => state.QuotationReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector(
    (state) => state.QuotationReducer.dateFilterEnd
  );
  const selectedDataList = useSelector(
    (state) => state.QuotationReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const columns = [
    { id: "code", label: "Code", align: "right" },
    { id: "target_year_quota", label: "Year", align: "right" },
    { id: "target_annual_quota", label: "Annual Quota", align: "right" },
    { id: "target_monthly_quota", label: "Monthly Quota", align: "right" },
    { id: "target_daily_quota", label: "Daily Quota", align: "right" },
    { id: "status", label: "Status", align: "right" },
  ];
  const onClickOpenAddModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        addModal: true,
      },
    });
  };
  const onClickCloseAddModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        addModal: false,
      },
    });
  };
  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        page: newPage,
      },
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
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
          dispatch(monthlyAndDailyQoutaByAnnualQouta(value));
        }, state.debounceDelay);
      }
    } catch (error) {
      console.error(error);
    }
  };
  //  const GetHomeServicesList = async () => {
  //   const values = getListParam();
  //   try {
  //     await dispatch(getHomeListServiceProvider(values) as any);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // React.useEffect(() => {
  //   // GetHomeServicesList();
  //   return () => cancelRequest();
  // }, [debounceSearch, refresh]);
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
    account_details,
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
