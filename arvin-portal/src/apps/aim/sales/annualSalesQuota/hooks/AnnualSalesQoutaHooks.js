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
  ViewSalesQuota,
} from "../actions/AnnualSalesQuotaActions";
import { decryptaes } from "../../../../../utils/LightSecurity";
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
  const editModal = useSelector(
    (state) => state.SalesDailyOutReducer.editModal
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
    { id: "january_sales_target", label: "January Quota", align: "left" },
    { id: "february_sales_target", label: "February Quota", align: "left" },
    { id: "march_sales_target", label: "March Quota", align: "left" },
    { id: "april_sales_target", label: "April Quota", align: "left" },
    { id: "may_sales_target", label: "May Quota", align: "left" },
    { id: "june_sales_target", label: "June Quota", align: "left" },
    { id: "july_sales_target", label: "July Quota", align: "left" },
    { id: "august_sales_target", label: "August Quota", align: "left" },
    { id: "september_sales_target", label: "September Quota", align: "left" },
    { id: "october_sales_target", label: "October Quota", align: "left" },
    { id: "november_sales_target", label: "November Quota", align: "left" },
    { id: "december_sales_target", label: "December Quota", align: "left" },
  ];
  const json_active_page = useSelector(
    (state) => state.AuthenticationReducer.active_page
  );
  const active_page = JSON.parse(json_active_page);

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
  }, [refresh, filterQuery, search, page]);

  React.useEffect(() => {
    dispatch(getAllRefSections());
    dispatch(getRefProductGroups());
    props.initialize({
      date_effectiveness: moment(new Date()).format("YYYY-01-01"),
      added_by: account_details?.code,
      modified_by: account_details?.code,
      monthly_sales_target: "",
    });
    return () => cancelRequest();
  }, []);

  const onClickOpenEditModal = (data) => {
    const response = dispatch(ViewSalesQuota(data.code));
    response.then((res) => {
      let sales_date = decryptaes(res.data);
      dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          selectedDataList: sales_date,
          editModal: true,
        },
      });
    });
  };
  const onClickCloseEditModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        editModal: false,
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
    account_details,
    product_group_category,
    sections,
    editModal,
    active_page,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    GetMonthlyAndDailyQoutaByAnnualQouta,
    onChangeFilter,
    onClickOpenEditModal,
    onClickCloseEditModal,
  };
};

export default AnnualSalesQoutaHooks;
