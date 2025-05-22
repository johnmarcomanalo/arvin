import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { geClientSalesSummaryReport } from "../actions/ClientSalesSummaryActions";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import swal from "sweetalert";
import { change } from "redux-form";
import { fetchGetClientGroups } from "apps/aim/sales/clientGroups/actions/ClientGroupsActions";
import { Warehouse } from "@mui/icons-material";
const DavaoTKSHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const user_access_product_group_rights =
    access?.user_access_product_group_rights;
  const client_groups = useSelector(
    (state) => state.SalesDailyOutReducer.client_groups
  );
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount
  );
  const employeeModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
  const user_access_organization_rights =
    access?.user_access_organization_rights;

  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const year =
    searchParams.get("year") != null
      ? String(searchParams.get("year"))
      : moment(new Date()).format("YYYY");
  const product =
    searchParams.get("product") != null
      ? String(searchParams.get("product"))
      : props.product || "";

  const group_code =
    searchParams.get("group_code") != null
      ? String(searchParams.get("group_code"))
      : "";

  const bdo =
    searchParams.get("bdo") != null
      ? String(searchParams.get("bdo"))
      : props.bdo_name
      ? props.bdo_name
      : "";

  const type =
    searchParams.get("t") != null
      ? String(searchParams.get("t"))
      : props.type
      ? props.type
      : "";

  const warehouse =
    searchParams.get("w") != null
      ? String(searchParams.get("w"))
      : props.subsection
      ? props.subsection
      : "";

  const limit =
    searchParams.get("tl") != null ? String(searchParams.get("tl")) : 10;

  const page =
    searchParams.get("tp") != null ? String(searchParams.get("tp")) : "1";

  const dispatch = useDispatch();

  const columns_out = [
    {
      id: "sales_daily_out_settings_client_groups_description",
      label: "Client Group",
      align: "left",
    },
    { id: "type", label: "Type", align: "left" },
    { id: "subsection", label: "Warehouse", align: "left" },
    { id: "year_sales_target", label: "Year", align: "left" },
    { id: "january_total_out", label: "January Sales", align: "left" },
    { id: "february_total_out", label: "February Sales", align: "left" },
    { id: "march_total_out", label: "March Sales", align: "left" },
    { id: "april_total_out", label: "April Sales", align: "left" },
    { id: "may_total_out", label: "May Sales", align: "left" },
    { id: "june_total_out", label: "June Sales", align: "left" },
    { id: "july_total_out", label: "July Sales", align: "left" },
    { id: "august_total_out", label: "August Sales", align: "left" },
    { id: "september_total_out", label: "September Sales", align: "left" },
    { id: "october_total_out", label: "October Sales", align: "left" },
    { id: "november_total_out", label: "November Sales", align: "left" },
    { id: "december_total_out", label: "December Sales", align: "left" },
    { id: "year_sales_daily_out", label: "Total Sales", align: "left" },
    {
      id: "bdo",
      label: "BDO",
      align: "left",
    },
  ];

  const columns_mtd_final_percentage = [
    {
      id: "sales_daily_out_settings_client_groups_description",
      label: "Client Group",
      align: "left",
    },
    { id: "type", label: "Type", align: "left" },
    { id: "subsection", label: "Warehouse", align: "left" },
    { id: "year_sales_target", label: "Year", align: "left" },
    {
      id: "mtd_january_final_percentage",
      label: "January Percentage",
      align: "left",
    },
    {
      id: "mtd_february_final_percentage",
      label: "February Percentage",
      align: "left",
    },
    {
      id: "mtd_march_final_percentage",
      label: "March Percentage",
      align: "left",
    },
    {
      id: "mtd_april_final_percentage",
      label: "April Percentage",
      align: "left",
    },
    { id: "mtd_may_final_percentage", label: "May Percentage", align: "left" },
    {
      id: "mtd_june_final_percentage",
      label: "June Percentage",
      align: "left",
    },
    {
      id: "mtd_july_final_percentage",
      label: "July Percentage",
      align: "left",
    },
    {
      id: "mtd_august_final_percentage",
      label: "August Percentage",
      align: "left",
    },
    {
      id: "mtd_september_final_percentage",
      label: "September Percentage",
      align: "left",
    },
    {
      id: "mtd_october_final_percentage",
      label: "October Percentage",
      align: "left",
    },
    {
      id: "mtd_november_final_percentage",
      label: "November Percentage",
      align: "left",
    },
    {
      id: "mtd_december_final_percentage",
      label: "December Percentage",
      align: "left",
    },
  ];

  const columns_ytd_final_percentage = [
    {
      id: "sales_daily_out_settings_client_groups_description",
      label: "Client Group",
      align: "left",
    },
    { id: "type", label: "Type", align: "left" },
    { id: "subsection", label: "Warehouse", align: "left" },
    { id: "year_sales_target", label: "Year", align: "left" },
    {
      id: "ytd_january_final_percentage",
      label: "January Percentage",
      align: "left",
    },
    {
      id: "ytd_february_final_percentage",
      label: "February Percentage",
      align: "left",
    },
    {
      id: "ytd_march_final_percentage",
      label: "March Percentage",
      align: "left",
    },
    {
      id: "ytd_april_final_percentage",
      label: "April Percentage",
      align: "left",
    },
    { id: "ytd_may_final_percentage", label: "May Percentage", align: "left" },
    {
      id: "ytd_june_final_percentage",
      label: "June Percentage",
      align: "left",
    },
    {
      id: "ytd_july_final_percentage",
      label: "July Percentage",
      align: "left",
    },
    {
      id: "ytd_august_final_percentage",
      label: "August Percentage",
      align: "left",
    },
    {
      id: "ytd_september_final_percentage",
      label: "September Percentage",
      align: "left",
    },
    {
      id: "ytd_october_final_percentage",
      label: "October Percentage",
      align: "left",
    },
    {
      id: "ytd_november_final_percentage",
      label: "November Percentage",
      align: "left",
    },
    {
      id: "ytd_december_final_percentage",
      label: "December Percentage",
      align: "left",
    },
  ];

  const onSelectItem = (data) => {
    console.log(data);
  };

  const onChangeFilterYear = (date) => {
    setSearchParams({
      year: date,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
  };

  const onChangeFilterProduct = (product) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
  };

  const onChangeFilterGroupCode = (group_code) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
  };

  const onChangeFilterBDO = (bdo) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo.username,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
    props.dispatch(change("ClientSummary", "bdo_name", bdo.full_name));
    swal("Success", "BDO filtered successfully", "success");
  };

  const onClickSelectResetEmployee = () => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: "",
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
    props.dispatch(change("ClientSummary", "bdo_name", ""));
  };

  const onClickSelectType = (type) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
    props.dispatch(change("ClientSummary", "type", type));
  };
  const onClickSelectWarehouse = (subsection) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: subsection,
      tl: limit,
      tp: "1",
    });
    props.dispatch(change("ClientSummary", "subsection", subsection));
  };
  const onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
      year: year,
      product: product,
      group_code: search,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: "1",
    });
    props.dispatch(change("ClientSummary", "type", type));
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: page,
    });
  };
  const getListParam = () => {
    const data = {
      year: year,
      product: product,
      group_code: group_code,
      bdo: bdo,
      t: type,
      w: warehouse,
      tl: limit,
      tp: page,
    };
    return data;
  };

  const getClientSummary = async () => {
    try {
      const data = getListParam();
      await dispatch(geClientSalesSummaryReport(data));
    } catch (error) {
      console.error(error);
    }
  };
  const GetClientGroups = async () => {
    try {
      dispatch(fetchGetClientGroups());
    } catch (error) {
      console.error(error);
    }
  };
  // React.useEffect(() => {
  //   // GetClientGroups();e
  // }, []);
  React.useEffect(() => {
    if (product !== "" && bdo !== "") {
      getClientSummary();
    }
    // props.initialize({
    //   product: product,
    // });
    return () => cancelRequest();
  }, [refresh, searchParams]);
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
  const exportToExcelMonthlySalesSummary = (
    dataList,
    fileName = "Annual Sales Out.xlsx"
  ) => {
    if (!dataList || dataList.length === 0) {
      console.warn("No data to export.");
      return;
    }

    // Define column mappings based on the `columns` array
    const columnMappings = {
      sales_daily_out_settings_client_groups_description: "Client Group",
      year_sales_target: "Year",
      january_total_out: "January Sales",
      february_total_out: "February Sales",
      march_total_out: "March Sales",
      april_total_out: "April Sales",
      may_total_out: "May Sales",
      june_total_out: "June Sales",
      july_total_out: "July Sales",
      august_total_out: "August Sales",
      september_total_out: "September Sales",
      october_total_out: "October Sales",
      november_total_out: "November Sales",
      december_total_out: "December Sales",
      year_sales_daily_out: "Total Sales",
      bdo: "BDO",
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
  const exportToExcelMonthlyMTDSummary = (
    dataList,
    fileName = "Annual Sales Out.xlsx"
  ) => {
    if (!dataList || dataList.length === 0) {
      console.warn("No data to export.");
      return;
    }

    // Define column mappings based on the `columns` array
    const columnMappings = {
      sales_daily_out_settings_client_groups_description: "Client Group",
      year_sales_target: "Year",
      mtd_january_final_percentage: "January Percentage",
      mtd_february_final_percentage: "February Percentage",
      mtd_march_final_percentage: "March Percentage",
      mtd_april_final_percentage: "April Percentage",
      mtd_may_final_percentage: "May Percentage",
      mtd_june_final_percentage: "June Percentage",
      mtd_july_final_percentage: "July Percentage",
      mtd_august_final_percentage: "August Percentage",
      mtd_september_final_percentage: "September Percentage",
      mtd_october_final_percentage: "October Percentage",
      mtd_november_final_percentage: "November Percentage",
      mtd_december_final_percentage: "December Percentage",
      bdo: "BDO",
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
  const exportToExcelMonthlyYTDSummary = (
    dataList,
    fileName = "Annual Sales Out.xlsx"
  ) => {
    if (!dataList || dataList.length === 0) {
      console.warn("No data to export.");
      return;
    }

    // Define column mappings based on the `columns` array
    const columnMappings = {
      sales_daily_out_settings_client_groups_description: "Client Group",
      year_sales_target: "Year",
      ytd_january_final_percentage: "January Percentage",
      ytd_february_final_percentage: "February Percentage",
      ytd_march_final_percentage: "March Percentage",
      ytd_april_final_percentage: "April Percentage",
      ytd_may_final_percentage: "May Percentage",
      ytd_june_final_percentage: "June Percentage",
      ytd_july_final_percentage: "July Percentage",
      ytd_august_final_percentage: "August Percentage",
      ytd_september_final_percentage: "September Percentage",
      ytd_october_final_percentage: "October Percentage",
      ytd_november_final_percentage: "November Percentage",
      ytd_december_final_percentage: "December Percentage",
      bdo: "BDO",
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
  // const initialization = async () => {
  //   try {
  //     props.initialize({
  //       year: year,
  //     });
  //   } catch (error) {
  //     await console.error(error);
  //   }
  // };

  // React.useEffect(() => {
  //   initialization();
  // }, []);
  return {
    year,
    product,
    group_code,
    bdo,
    dataList,
    columns_out,
    state,
    columns_mtd_final_percentage,
    columns_ytd_final_percentage,
    user_access_product_group_rights,
    client_groups,
    employeeModal,
    user_access_organization_rights,
    dataListCount,
    page,
    onSelectItem,
    exportToExcelMonthlySalesSummary,
    exportToExcelMonthlyMTDSummary,
    exportToExcelMonthlyYTDSummary,
    onChangeFilterYear,
    onChangeFilterProduct,
    onChangeFilterGroupCode,
    onChangeFilterBDO,
    onClickOpenEmployeeViewModal,
    onClickCloseEmployeeViewModal,
    onClickSelectResetEmployee,
    onClickSelectType,
    onClickSelectWarehouse,
    handleChangePage,
    onChangeSearch,
  };
};

export default DavaoTKSHooks;
