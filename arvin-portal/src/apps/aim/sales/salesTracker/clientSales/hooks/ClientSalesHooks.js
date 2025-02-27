import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../../reducer/Contants";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import swal from "sweetalert";
import { getEmployeeOrganizationAccessList } from "../../../../settings/accessrights/organizationrights/actions/OrganizationRightsActions";
import {
  getClientSalesTracker,
  getStatusDailyTargetAndPercentageDailyTargetByDailyOut,
} from "../actions/ClientSalesActions";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchGetClientGroups } from "../../../clientGroups/actions/ClientGroupsActions";
import { change } from "redux-form";

const SalesDailyOutComponentSalesDailyOutHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    year: moment(new Date()).format("YYYY"),
    active_subsections: null,
  });
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const year =
    searchParams.get("y") != undefined
      ? searchParams.get("y")
      : moment(new Date()).format("YYYY");

  const month =
    searchParams.get("m") != null
      ? String(searchParams.get("m"))
      : moment(new Date()).format("MM");

  const product =
    searchParams.get("pr") != null ? String(searchParams.get("pr")) : "";

  const group_code =
    searchParams.get("c") != null ? String(searchParams.get("c")) : "";

  const bdo =
    searchParams.get("b") != null ? String(searchParams.get("b")) : "";

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
  const final_ytd_data = useSelector(
    (state) => state.SalesDailyOutReducer.final_ytd_data
  );
  const dateFilter = useSelector(
    (state) => state.SalesDailyOutReducer.dateFilter
  );
  const filterModal = useSelector(
    (state) => state.SalesDailyOutReducer.filterModal
  );
  const user_access_organization_rights =
    access?.user_access_organization_rights;

  const user_access_product_group_rights =
    access?.user_access_product_group_rights;
  const product_group_unit_of_measure = useSelector(
    (state) => state.SalesDailyOutReducer.product_group_unit_of_measure
  );
  const product_group_unit_of_measure_type = useSelector(
    (state) => state.SalesDailyOutReducer.product_group_unit_of_measure_type
  );
  const client_groups = useSelector(
    (state) => state.SalesDailyOutReducer.client_groups
  );
  const employeeModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
  const columns = [
    {
      id: "bdo",
      label: "BDO",
      align: "left",
    },
    {
      id: "sales_daily_out_settings_annual_quota_client_groups_code",
      label: "Code",
      align: "left",
    },
    {
      id: "sales_daily_out_settings_client_groups_description",
      label: "Client",
      align: "left",
    },
    {
      id: "month_sales_daily_qouta",
      label: "Monthly Quota",
      align: "left",
    },
    {
      id: "1-7",
      label: "1-7",
      align: "left",
    },
    {
      id: "8-14",
      label: "8-14",
      align: "left",
    },
    {
      id: "15-21",
      label: "15-21",
      align: "left",
    },
    {
      id: "22-30/31",
      label: "22-30/31",
      align: "left",
    },
    {
      id: "month_sales_daily_out",
      label: "Monthly Total Out",
      align: "left",
    },
    {
      id: "mtd_total_daily_qouta_amount",
      label: "MTD Total Quota",
      align: "left",
    },
    {
      id: "mtd_total_daily_out_amount",
      label: "MTD Total Out",
      align: "left",
    },
    {
      id: "mtd_total_status_daily_target",
      label: "MTD Balance to Sell",
      align: "left",
    },
    {
      id: "mtd_final_percentage",
      label: "MTD Final Percentage",
      align: "left",
    },
    {
      id: "ytd_final_percentage",
      label: "YTD Final Percentage",
      align: "left",
    },
    {
      id: "ytd_total_daily_qouta_amount",
      label: "YTD Total Quota Amount",
      align: "left",
    },
    {
      id: "ytd_total_daily_out_amount",
      label: "YTD Total Out Amount",
      align: "left",
    },
    {
      id: "ytd_total_status_daily_target",
      label: "YTD Balance to Sell",
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

  const onSelectItem = (data) => {
    console.log(data);
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    // const search = event.target.value;
    // setSearchParams({
    //   q: search,
    //   p: "1",
    //   l: String(rowsPerPage),
    //   f: filterQuery,
    //   sc: filterSubComponent,
    //   pg: filterProductGroup,
    // });
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
    let selected_year = moment(date).format("YYYY");
    let selected_month = moment(date).format("MM");
    setSearchParams({
      y: selected_year,
      m: selected_month,
      pr: product,
      c: group_code,
      b: bdo,
    });
  };

  const getListParam = () => {
    const data = {
      y: year,
      m: month,
      pr: product,
      c: group_code,
      b: bdo,
    };
    return data;
  };
  const GetClientSales = async () => {
    try {
      const data = await getListParam();
      await dispatch(getClientSalesTracker(data));
    } catch (error) {
      console.error(error);
    }
  };
  const GetAnnualMonthlyDailyTargetSalesBySectionSubsection = () => {
    // try {
    //   dispatch(
    //     getAnnualMonthlyDailyTargetSalesBySectionSubsection(
    //       filterSubComponent == ""
    //         ? account_details?.subsection_code
    //         : filterSubComponent,
    //       moment(filterQuery).format("YYYY-MM"),
    //       filterProductGroup
    //     )
    //   );
    // } catch (error) {
    //   console.error(error);
    // }
  };
  const GetSpecificRefSubSection = () => {
    // try {
    //   let id = account_details?.subsection_code;
    //   if (typeof filterSubComponent !== null || filterSubComponent !== "") {
    //     id = filterSubComponent;
    //   }
    //   dispatch(getSpecificRefSubSection(account_details?.subsection_code));
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const onFetchOrganizationAccess = async (data, values) => {
    await dispatch(getEmployeeOrganizationAccessList(account_details.code));
  };

  const GetClientGroups = async () => {
    try {
      dispatch(fetchGetClientGroups());
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    onFetchOrganizationAccess();
    GetClientGroups();
  }, []);
  React.useEffect(() => {
    GetClientSales();
  }, [refresh, year, month, product, group_code, bdo]);
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
    // let filterSubComponent = data.code;
    // setSearchParams({
    //   p: page == null ? 1 : page,
    //   q: search,
    //   l: rowsPerPage,
    //   f: filterQuery,
    //   sc: filterSubComponent,
    //   pg: filterProductGroup,
    // });
    // setState((prev) => ({
    //   ...prev,
    //   active_subsections: data.description, // Update the state to trigger re-render
    // }));
  };

  const filterProductGroups = (description) => {
    setSearchParams({
      y: year,
      m: month,
      pr: description,
      c: group_code,
      b: bdo,
    });
  };

  const filterClientGroups = (code) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: code,
      b: bdo,
    });
  };

  const exportToExcel = (dataList) => {
    if (!dataList || dataList.length === 0) {
      console.warn("No data to export.");
      return;
    }
    let fileName =
      "Client Sales Tracker " +
      "(" +
      year +
      "-" +
      month +
      ") " +
      (product ? product : " All Product ") +
      "-" +
      (group_code ? group_code : " All Group ") +
      "-" +
      (bdo ? bdo : "All BDO") +
      ".xlsx";
    // Define column mappings based on the updated `columns` array
    const columnMappings = {
      bdo: "BDO",
      // sales_daily_out_settings_annual_quota_client_groups_code: "Code",
      sales_daily_out_settings_client_groups_description: "Client",
      month_sales_daily_qouta: "Monthly Quota",
      "1-7": "1-7",
      "8-14": "8-14",
      "15-21": "15-21",
      "22-30/31": "22-30/31",
      month_sales_daily_out: "Monthly Out",
      mtd_total_daily_qouta_amount: "MTD Total Quota",
      mtd_total_daily_out_amount: "MTD Total Out",
      mtd_total_status_daily_target: "MTD Balance to Sell",
      mtd_final_percentage: "MTD Final Percentage",
      ytd_final_percentage: "YTD Final Percentage",
      ytd_total_daily_qouta_amount: "YTD Total Quota",
      ytd_total_daily_out_amount: "YTD Total Out",
      ytd_total_status_daily_target: "YTD Balance to Sell",
    };

    // Convert data to new format with renamed keys
    const formattedData = dataList.map((item) => {
      let newItem = {};
      Object.keys(columnMappings).forEach((key) => {
        newItem[columnMappings[key]] = item[key]; // Use mapped column name
      });
      return newItem;
    });

    // Convert JSON to worksheet with renamed headers
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook and convert to Blob
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save the file
    saveAs(blob, fileName);
  };
  const onClickOpenEmployeeViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseEmployeeViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: false,
      },
    });
  };
  const onClickSelectEmployee = (bdo) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_code,
      b: bdo.username,
    });
    props.dispatch(change("ClientSales", "bdo_name", bdo.full_name));
    swal("Success", "BDO filtered successfully", "success");
  };
  const onClickSelectResetEmployee = () => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_code,
      b: "",
    });
    props.dispatch(change("ClientSales", "bdo_name", ""));
  };
  return {
    dataList,
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
    final_ytd_data,
    selected_subsection,
    dateFilter,
    user_access_organization_rights,
    filterModal,
    state,
    active_page,
    user_access_product_group_rights,
    product_group_unit_of_measure,
    product_group_unit_of_measure_type,
    client_groups,
    employeeModal,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection,
    GetStatusDailyTargetAndPercentageDailyTargetByDailyOut,
    filterMonthAndYear,
    onClickOpenFilterModal,
    onClickCloseFilterModal,
    filterSubComponents,
    filterProductGroups,
    exportToExcel,
    filterClientGroups,
    onClickOpenEmployeeViewModal,
    onClickCloseEmployeeViewModal,
    onClickSelectEmployee,
    onClickSelectResetEmployee,
  };
};

export default SalesDailyOutComponentSalesDailyOutHooks;
