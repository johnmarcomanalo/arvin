import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { getDavaoTKSSummaryReport } from "../actions/DavaoTKSActions";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const DavaoTKSHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const refresh2 = useSelector((state) => state.SalesDailyOutReducer.refresh2);
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const viewModal = useSelector((state) => state.ReferenceReducer.viewModal);

  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    type: [
      { type: "create_date", description: "Create Date" },
      { type: "delivery_date", description: "Delivery Date" },
    ],
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const filterStartQuery =
    searchParams.get("ds") != null
      ? String(searchParams.get("ds"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery =
    searchParams.get("de") != null
      ? String(searchParams.get("de"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterType =
    searchParams.get("t") != null
      ? String(searchParams.get("t"))
      : "Create Date";

  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();

  const columns = [
    { id: "create_date", label: "Create Date", align: "left" },
    { id: "delivery_date", label: "Delivery Date", align: "left" },
    { id: "dr_number", label: "DR Number", align: "left" },
    { id: "si_number", label: "SI Number", align: "left" },
    { id: "card_name", label: "Card Name", align: "left" },
    { id: "client_name", label: "Client Name", align: "left" },
    { id: "terms", label: "Payment Group", align: "left" },
    { id: "payment_mode", label: "Mode Payment", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "quantity", label: "Quantity", align: "left" },
    { id: "price_after_vat", label: "Price after VAT", align: "left" },
    { id: "line_amount", label: "Line Amount", align: "left" },
    { id: "doc_total", label: "Doc Total", align: "left" },
    { id: "applied_amount", label: "Applied Amount", align: "left" },
    {
      id: "actual_mode_payment",
      label: "Actual Mode of Payment",
      align: "left",
    },
  ];
  const handleChangePage = (event, page) => {
    setSearchParams({
      ds: filterStartQuery,
      de: filterEndQuery,
      t: filterType,
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
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      ds: filterStartQuery,
      de: filterEndQuery,
      t: filterType,
    });
  };
  const onChangeFilterStart = (date) => {
    setSearchParams({
      ds: date,
      de: filterEndQuery,
      t: filterType,
    });
  };
  const onChangeFilterEnd = (date) => {
    // SEARCH DATA
    setSearchParams({
      ds: filterStartQuery,
      de: date,
      t: filterType,
    });
  };
  const onChangeFilterType = (type) => {
    // SEARCH DATA
    setSearchParams({
      ds: filterStartQuery,
      de: filterEndQuery,
      t: type,
    });
  };
  const getListParam = () => {
    const data = {
      ds: filterStartQuery,
      de: filterEndQuery,
      t: filterType,
    };
    return data;
  };

  const getDavaoTKSSummaryReports = async () => {
    try {
      const data = getListParam();
      await dispatch(getDavaoTKSSummaryReport(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getDavaoTKSSummaryReports();
    return () => cancelRequest();
  }, [refresh, filterStartQuery, filterEndQuery, search, filterType]);

  const exportToExcel = (dataList, fileName = "data.xlsx") => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataList);

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

  const initialization = async () => {
    try {
      props.initialize({
        type: filterType,
        date_start: filterStartQuery,
        date_end: filterEndQuery,
      });
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => {
    initialization();
  }, []);
  return {
    search,
    page,
    dataList,
    rowsPerPage,
    dataListCount,
    columns,
    addModal,
    account_details,
    viewModal,
    state,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onChangeSearch,
    onChangeFilterStart,
    onChangeFilterEnd,
    exportToExcel,
    onChangeFilterType,
  };
};

export default DavaoTKSHooks;
