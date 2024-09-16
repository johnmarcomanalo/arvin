import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getAnnualMonthlyDailyTargetSalesBySectionSubsection } from "../../salesQuota/actions/SalesQuotaActions";
import {
  getSalesDailyOut,
  getStatusDailyTargetAndPercentageDailyTargetByDailyOut,
} from "../actions/SalesTrackerActions";
import { getSpecificRefSubSection } from "../../../settings/reference/actions/ReferenceActions";
import { getEmployeeOrganizationAccessList } from "../../../settings/accessrights/organizationrights/actions/OrganizationRightsActions";
const SalesDailyOutComponentSalesDailyOutHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    year: moment(new Date()).format("YYYY"),
    active_subsections: null,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != undefined ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 30;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null
      ? String(searchParams.get("f"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterSubComponent =
    searchParams.get("sc") != null ? String(searchParams.get("sc")) : "";
  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const json_active_page = useSelector(
    (state) => state.AuthenticationReducer.active_page
  );
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const present_mtd_data = useSelector(
    (state) => state.SalesDailyOutReducer.present_mtd_data
  );
  const selected_subsection = useSelector(
    (state) => state.ReferenceReducer.selected_subsection
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
  const final_mtd_data = useSelector(
    (state) => state.SalesDailyOutReducer.final_mtd_data
  );
  const dateFilter = useSelector(
    (state) => state.SalesDailyOutReducer.dateFilter
  );
  const filterModal = useSelector(
    (state) => state.SalesDailyOutReducer.filterModal
  );
  const user_access_organization_rights =
    access?.user_access_organization_rights;
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
      sc: filterSubComponent,
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
      sc: filterSubComponent,
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
      sc: filterSubComponent,
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
      u: account_details?.code,
      sc:
        filterSubComponent == ""
          ? account_details?.subsection_code
          : filterSubComponent,
    };
    return data;
  };
  const GetSalesDailyOut = async () => {
    try {
      const data = await getListParam();
      await dispatch(getSalesDailyOut(data));
    } catch (error) {
      console.error(error);
    }
  };
  const GetAnnualMonthlyDailyTargetSalesBySectionSubsection = () => {
    try {
      dispatch(
        getAnnualMonthlyDailyTargetSalesBySectionSubsection(
          filterSubComponent == ""
            ? account_details?.subsection_code
            : filterSubComponent,
          moment(filterQuery).format("YYYY-MM")
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  const GetSpecificRefSubSection = () => {
    try {
      let id = account_details?.subsection_code;
      if (typeof filterSubComponent !== null || filterSubComponent !== "") {
        id = filterSubComponent;
      }
      console.log(id);
      dispatch(getSpecificRefSubSection(account_details?.subsection_code));
    } catch (error) {
      console.error(error);
    }
  };

  const onFetchOrganizationAccess = async (data, values) => {
    await dispatch(getEmployeeOrganizationAccessList(account_details.code));
  };

  React.useEffect(() => {
    onFetchOrganizationAccess();
  }, []);
  React.useEffect(() => {
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection();
    GetSalesDailyOut();
    GetSpecificRefSubSection();
  }, [refresh, debounceSearch, filterQuery, filterSubComponent]);
  const onClickOpenFilterModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        filterModal: true,
      },
    });
  };
  const onClickCloseFilterModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        filterModal: false,
      },
    });
  };
  const filterSubComponents = (data) => {
    let filterSubComponent = data.code;
    setSearchParams({
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      sc: filterSubComponent,
    });
    setState((prev) => ({
      ...prev,
      active_subsections: data.description, // Update the state to trigger re-render
    }));
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
    report_data,
    annual_sales_target,
    monthly_sales_target,
    daily_sales_target,
    present_mtd_data,
    previous_mtd_data,
    final_mtd_data,
    selected_subsection,
    dateFilter,
    user_access_organization_rights,
    filterModal,
    state,
    active_page,
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
    onClickOpenFilterModal,
    onClickCloseFilterModal,
    filterSubComponents,
  };
};

export default SalesDailyOutComponentSalesDailyOutHooks;
