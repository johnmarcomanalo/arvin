import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import {
  getAllRefSections,
  getRefProductGroups,
} from "../../../settings/reference/actions/ReferenceActions";
import {
  getAnnualSettingSale,
  getMonthlyAndDailyQoutaByTargetAnnualSales,
} from "../actions/AnnualSalesQuotaActions";
const AnnualSalesQoutaHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
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
  const product_group_category = useSelector(
    (state) => state.ReferenceReducer.product_group_category
  );
  const sections = useSelector((state) => state.ReferenceReducer.sections);

  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "year_sales_target", label: "Year", align: "left" },
    { id: "sub_section", label: "Subsection", align: "left" },
    {
      id: "ref_product_groups_description",
      label: "Product Group",
      align: "left",
    },
    { id: "annual_sales_target", label: "Annual Quota", align: "left" },
    { id: "monthly_sales_target", label: "Monthly Quota", align: "left" },
    // { id: "daily_sales_target", label: "Daily Quota", align: "left" },
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
      u: account_details?.code,
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
  const onChangeFilter = (date) => {
    const filter = date;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filter,
      u: account_details?.code,
    });
  };
  React.useEffect(() => {
    GetAnnualSettingSaleList();
    return () => cancelRequest();
  }, [refresh, filterQuery, search]);

  React.useEffect(() => {
    dispatch(getAllRefSections());
    dispatch(getRefProductGroups());
    props.initialize({
      date_effectiveness: moment(new Date()).format("YYYY-01-01"),
      added_by: account_details?.code,
      modified_by: account_details?.code,
      monthly_sales_target: ''
    });
    return () => cancelRequest();
  }, []);
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
    product_group_category,
    sections,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    GetMonthlyAndDailyQoutaByAnnualQouta,
    onChangeFilter,
  };
};

export default AnnualSalesQoutaHooks;
