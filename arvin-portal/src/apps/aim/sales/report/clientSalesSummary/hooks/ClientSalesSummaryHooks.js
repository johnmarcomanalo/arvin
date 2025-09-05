import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { getEmployeeOrganizationAccessList } from "../../../../settings/accessrights/organizationrights/actions/OrganizationRightsActions";
import {
  getClientSalesTracker,
  geClientSalesSummaryReport,
  } from "../actions/ClientSalesSummaryActions";
import { change } from "redux-form";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const ClientSalesSummaryHooks = (props) => {
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

  //week
  const year                               = searchParams.get("y") != undefined ? searchParams.get("y") : moment(new Date()).format("YYYY");
  const month                              = searchParams.get("m") != null ? String(searchParams.get("m")) : moment(new Date()).format("MM");
  const product                            = searchParams.get("pr") != null ? String(searchParams.get("pr")) : props.product_group ? props.product_group : "";
  const group_description                  = searchParams.get("c") != null ? String(searchParams.get("c")) : "";
  const bdo                                = searchParams.get("b") != null? String(searchParams.get("b")):"";
  const type                               = searchParams.get("t") != null? String(searchParams.get("t")):"";
  const subsection                         = searchParams.get("w") != null? String(searchParams.get("w")):"";
  const page                               = searchParams.get("tp") != null ? searchParams.get("tp") : 1;
  const rowsPerPage                        = searchParams.get("tl") != null ? searchParams.get("tl") : 10;
  const group_code                         = searchParams.get("group_code") != null ? String(searchParams.get("group_code")): "";

  //month
  const _year                              = searchParams.get("year") != undefined ? searchParams.get("year") : moment(new Date()).format("YYYY");
  const _product                           = searchParams.get("product") != null ? String(searchParams.get("product")) : props.product_group ? props.product_group : "";
  const _group_description                 = searchParams.get("group_code") != null ? String(searchParams.get("group_code")) : "";
  const _bdo                               = searchParams.get("bdo") != null? String(searchParams.get("bdo")): "";
  const _type                              = searchParams.get("t") != null? String(searchParams.get("t")): "";
  const _subsection                        = searchParams.get("w") != null? String(searchParams.get("w")): "";
  const _page                              = searchParams.get("tp") != null ? searchParams.get("tp") : 1;
  const _rowsPerPage                       = searchParams.get("tl") != null ? searchParams.get("tl") : 10;
  const dataList2                          = useSelector((state) => state.SalesDailyOutReducer.dataList2);
  const dataListCount2                     = useSelector((state) => state.SalesDailyOutReducer.dataListCount2);

  //filtering,search,page,limit end
  const dispatch                           = useDispatch();
  const access                             = useSelector((state) => state.AuthenticationReducer.access);
  const json_active_page                   = useSelector((state) => state.AuthenticationReducer.active_page);
  const addModal                           = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const dataList                           = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const present_mtd_data                   = useSelector((state) => state.SalesDailyOutReducer.present_mtd_data);
  const selected_subsection                = useSelector((state) => state.ReferenceReducer.selected_subsection);
  const previous_mtd_data                  = useSelector((state) => state.SalesDailyOutReducer.previous_mtd_data);
  const report_data                        = useSelector((state) => state.SalesDailyOutReducer.report_data);
  const dataListCount                      = useSelector((state) => state.SalesDailyOutReducer.dataListCount);
  const dateFilterStart                    = useSelector((state) => state.SalesDailyOutReducer.dateFilterStart);
  const dateFilterEnd                      = useSelector((state) => state.SalesDailyOutReducer.dateFilterEnd);
  const selectedDataList                   = useSelector((state) => state.SalesDailyOutReducer.selectedDataList);
  const annual_sales_target                = useSelector((state) => state.SalesDailyOutReducer.annual_sales_target);
  const monthly_sales_target               = useSelector((state) => state.SalesDailyOutReducer.monthly_sales_target);
  const daily_sales_target                 = useSelector((state) => state.SalesDailyOutReducer.daily_sales_target);
  const final_ytd_data                     = useSelector((state) => state.SalesDailyOutReducer.final_ytd_data);
  const dateFilter                         = useSelector((state) => state.SalesDailyOutReducer.dateFilter);
  const filterModal                        = useSelector((state) => state.SalesDailyOutReducer.filterModal);
  const user_access_organization_rights    = access?.user_access_organization_rights;
  const user_access_product_group_rights   = access?.user_access_product_group_rights;
  const product_group_unit_of_measure      = useSelector((state) => state.SalesDailyOutReducer.product_group_unit_of_measure);
  const product_group_unit_of_measure_type = useSelector((state) => state.SalesDailyOutReducer.product_group_unit_of_measure_type);
  const client_groups                      = useSelector((state) => state.SalesDailyOutReducer.client_groups);
  const employeeModal                      = useSelector((state) => state.HumanResourceReducer.viewModal);

  const columns_week = [
   
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
      label: "Week 1",
      align: "left",
    },
    {
      id: "week_one_percentage",
      label: "Week 1 (%)",
      align: "left",
    },
    {
      id: "8-14",
      label: "Week 2",
      align: "left",
    },
    {
      id: "week_two_percentage",
      label: "Week 2 (%)",
      align: "left",
    },
    {
      id: "15-21",
      label: "Week 3",
      align: "left",
    },
    {
      id: "week_three_percentage",
      label: "Week 3 (%)",
      align: "left",
    },
    {
      id: "22-30/31",
      label: "Week 4",
      align: "left",
    },
    {
      id: "week_three_percentage",
      label: "Week 4 (%)",
      align: "left",
    },
    {
      id: "month_sales_daily_out",
      label: "Monthly Total Out",
      align: "left",
    }
  ];


  const columns_month = [
    {
      id: "sales_daily_out_settings_client_groups_description",
      label: "Client",
      align: "left",
    },
    { id: "january_total_out", label: "January", align: "left" },
    { id: "february_total_out", label: "February", align: "left" },
    { id: "march_total_out", label: "March", align: "left" },
    { id: "april_total_out", label: "April", align: "left" },
    { id: "may_total_out", label: "May", align: "left" },
    { id: "june_total_out", label: "June", align: "left" },
    { id: "july_total_out", label: "July", align: "left" },
    { id: "august_total_out", label: "August", align: "left" },
    { id: "september_total_out", label: "September", align: "left" },
    { id: "october_total_out", label: "October", align: "left" },
    { id: "november_total_out", label: "November", align: "left" },
    { id: "december_total_out", label: "December", align: "left" },
    { id: "annual_quota", label: "Quota", align: "left" },
    { id: "year_sales_daily_out", label: "Total", align: "left" },
    { id: "annual_quota_percentage", label: "YTD", align: "left" },
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

 
  const filterMonthAndYear = (year,month) => { 
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
  };

  const onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: search,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: "1",
    });
  };

  const getListParam = () => {
    const data = {
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    };
    return data;
  };

  const getListParam2 = () => {
    const data = { 
      year: _year,
      product: _product,
      group_code: _group_description,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(rowsPerPage),
      tp: page,
    };
    return data;
  };

  const onFetchOrganizationAccess = async (data, values) => {
    await dispatch(getEmployeeOrganizationAccessList(account_details.code));
  };

  const GetClientSales = async () => {
    try {
      const data = await getListParam();
      await dispatch(getClientSalesTracker(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    onFetchOrganizationAccess();
  

  }, []); 
  
  React.useEffect(() => {
    if (product && year && month) {
      GetClientSales();
    }
  }, [
    refresh,
    year,
    month,
    product,
    group_description,
    bdo,
    type,
    subsection,
    page,
  ]);

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
 
  const filterProductGroups = (description) => {
    setSearchParams({
      y: year,
      m: month,
      pr: description,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
  };

  const filterClientGroups = (code) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: code,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
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
      c: group_description,
      b: bdo.username,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
    props.dispatch(change("ClientSales", "bdo_name", bdo.full_name));
    swal("Success", "BDO filtered successfully", "success");
  };
  const onClickSelectResetEmployee = () => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: "",
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
    props.dispatch(change("ClientSales", "bdo_name", ""));
  };

  const onClickSelectType = (type) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
  };


  console.log(type)

  const onClickSelectWarehouse = (subsection) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_description,
      b: bdo,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
  };
  
  const onChangeFilterBDO = (bdo) => {
    setSearchParams({
      y: year,
      m: month,
      pr: product,
      c: group_code,
      b: bdo.username,
      t: type,
      w: subsection,
      tl: String(rowsPerPage),
      tp: page,
    });
    props.dispatch(change("ClientSalesSummary", "bdo_name", bdo.full_name));
    swal("Success", "BDO filtered successfully", "success");
  };

  const exportToExcel = (dataList, fileName = "data.xlsx") => {
    if (!dataList || dataList.length === 0) {
      console.warn("No data to export.");
      return;
    }

    // Define column mappings based on the `columns` array
    const columnMappings = {
      create_date: "Create Date",
      delivery_date: "Delivery Date",
      dr_number: "DR Number",
      si_number: "SI Number",
      card_name: "BP Name",
      client_name: "Client Name",
      terms: "BP Terms",
      payment_mode: "BP Payment Terms",
      description: "Item Name",
      quantity: "Quantity",
      price_after_vat: "Unit Price",
      line_amount: "Total",
      doc_total: "Amount Due",
      applied_amount: "Payment",
      actual_mode_payment: "Actual Payment Terms",
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
   

  /*
  For yearly table
  */

  const GetSalesMonthly = async () => {
    try {
      const data = await getListParam2();
      // await dispatch(geClientSalesSummaryReport(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (_product && _year) {
      GetSalesMonthly();
    }
  }, [
    refresh,
    _year,
    _product,
    _group_description,
    _bdo,
    _type,
    _subsection,
    _page,
  ]);

  const month_filterProductGroups = (description) => {
    setSearchParams({
      year: _year,
      product: description,
      group_code: _group_description,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: _page,
    });
  };
  
  const month_filterClientGroups = (code) => {
    setSearchParams({
      year: _year, 
      product: _product,
      group_code: code,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: _page,
    });
  };

  const month_onChangeFilterYear = (date) => {
    let year = moment(date).format("YYYY"); 
    setSearchParams({
      year: year, 
      product: _product,
      group_code: _group_description,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: _page,
    });
  };

  const month_onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
      year: _year, 
      product: _product,
      group_code: search,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: "1",
    });
  };

  const month_onClickSelectType = (type) => {
    setSearchParams({
      year: _year, 
      product: _product,
      group_code: _group_description,
      bdo: _bdo,
      t: type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: _page,
    });
  };

  const month_onClickSelectWarehouse = (subsection) => {
    setSearchParams({
      year: _year, 
      product: _product,
      group_code: _group_description,
      bdo: _bdo,
      t: _type,
      w: subsection,
      tl: String(_rowsPerPage),
      tp: _page,
    });
  };
  const month_handleChangePage = (event, page) => {
    setSearchParams({
      year: _year, 
      product: _product,
      group_code: _group_description,
      bdo: _bdo,
      t: _type,
      w: _subsection,
      tl: String(_rowsPerPage),
      tp: page,
    });
  };

  return {
    year,
    month,
    dataList,
    dataListCount,
    dateFilterStart,
    dateFilterEnd,
    selectedDataList,
    columns_week,
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
    subsection,
    page,
    dataList2,
    dataListCount2,
    columns_month,
    handleChangePage,
    onChangeSearch,
    onClickOpenAddModal,
    onClickCloseAddModal,
    filterMonthAndYear,
    onClickOpenFilterModal,
    onClickCloseFilterModal,
    filterProductGroups,
    filterClientGroups,
    onClickOpenEmployeeViewModal,
    onClickCloseEmployeeViewModal,
    onClickSelectEmployee,
    onClickSelectResetEmployee,
    onClickSelectType,
    onClickSelectWarehouse,
    onChangeFilterBDO,
    month_onChangeFilterYear,
    month_onChangeSearch,
    month_onClickSelectType,
    month_onClickSelectWarehouse,
    month_handleChangePage,
    month_filterProductGroups,
    month_filterClientGroups,
    exportToExcel,
  };
};

export default ClientSalesSummaryHooks;
