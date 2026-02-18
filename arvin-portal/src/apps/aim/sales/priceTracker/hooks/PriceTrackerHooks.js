import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { getReferenceSalesRankingPlacements } from "../../rankingPoints/actions/SalesRankingPointsActions";
import { getPrice, getPriceHistory } from "../actions/PriceTrackerActions";
const PriceTrackerHooks = (props) => {
  const dispatch = useDispatch();
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataListCount,
  );
  const viewModal = useSelector(
    (state) => state.SalesDailyOutReducer.viewModal,
  );
  const dataSubList = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubList,
  );
  const dataSubListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubListCount,
  );
  const last_page = useSelector(
    (state) => state.SalesDailyOutReducer.last_page,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page =
    searchParams.get("p") != null ? Number(searchParams.get("p")) : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 20;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "Manila";
  const warehouseQuery =
    searchParams.get("w") != null ? String(searchParams.get("w")) : "";
  const dateQuery =
    searchParams.get("d") != null ? String(searchParams.get("d")) : "";

  const json_active_page = useSelector(
    (state) => state.AuthenticationReducer.active_page,
  );
  const loading = useSelector((state) => state.SalesDailyOutReducer.loading);
  const active_page = JSON.parse(json_active_page);
  const columns = [
    { id: "ItemCode", label: "Code", align: "left" },
    { id: "ItemName", label: "Description", align: "left" },
    { id: "PickupPrice", label: "Current Price", align: "right" },
    { id: "PreviousPrice", label: "Previous Price", align: "right" },
    { id: "SKU", label: "SKU", align: "right" },
    { id: "Warehouse", label: "Warehouse", align: "left" },
    { id: "Brand", label: "Brand", align: "left" },
    // { id: "TaxCode", label: "TaxCode", align: "left" },
  ];
  const type = [
    { code: "manila", description: "Manila" },
    { code: "province", description: "Province" },
  ];

  const tableRef = React.useRef(null);

  const warehouses = [
    { code: "HARBOUR", description: "HARBOUR", type: "manila" },
    { code: "PAMPANGA", description: "PAMPANGA", type: "manila" },
    { code: "MALABON", description: "MALABON", type: "manila" },
    { code: "CALACA", description: "CALACA", type: "manila" },
    { code: "PNOC", description: "PNOC", type: "manila" },
    { code: "BSC", description: "BSC", type: "manila" },
    { code: "BULACAN", description: "BULACAN", type: "manila" },

    { code: "BACOLOD", description: "BACOLOD", type: "province" },
    { code: "CAGAYAN", description: "CAGAYAN", type: "province" },
    { code: "CEBU", description: "CEBU", type: "province" },
    { code: "DAVAO", description: "DAVAO", type: "province" },
    { code: "GENSAN", description: "GENSAN", type: "province" },
    { code: "ILOILO", description: "ILOILO", type: "province" },
    { code: "SURIGAO", description: "SURIGAO", type: "province" },
    { code: "TABACO", description: "TABACO", type: "province" },
    { code: "ZAMBOANGA", description: "ZAMBOANGA", type: "province" },
  ];

  const columns_history = [
    // { id: "ItemCode", label: "Code", align: "left" },
    // { id: "ItemName", label: "Daily Description", align: "left" },
    { id: "Time_Stamp_Formatted", label: "Time_Stamp", align: "left" },
    // { id: "PickupPrice", label: "Pick-up Price", align: "right" },
    { id: "OldPrice", label: "Previous Price", align: "right" },
    // { id: "SKU", label: "SKU", align: "right" },
    // { id: "Warehouse", label: "Warehouse", align: "left" },
    // { id: "Brand", label: "Brand", align: "left" },
    // { id: "TaxCode", label: "TaxCode", align: "left" },
  ];

  const [filteredWarehouses, setWarehouses] = React.useState(warehouses);
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    });
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 0 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    };
    return data;
  };
  const onChangeFilter = (data) => {
    const filter = data;

    const filteredWarehouses = warehouses.filter(
      (warehouse) => warehouse.type === filter,
    );
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filter,
      w: "",
      d: "",
    });

    setWarehouses(filteredWarehouses);
  };
  const onChangeWarehouse = (data) => {
    const warehouse = data;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouse,
      d: "",
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      q: search,
      p: page,
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    });
  };
  const handleChangeRowsPerPage = (value) => {
    const lpage = value.target;
    setSearchParams({
      q: search,
      p: page,
      l: String(lpage.value),
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    });
  };
  const getPriceTracker = async () => {
    try {
      const data = getListParam();
      await dispatch(getPrice(data));
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => {
    getPriceTracker();
    return () => cancelRequest();
  }, [
    refresh,
    filterQuery,
    search,
    page,
    warehouseQuery,
    rowsPerPage,
    dateQuery,
  ]);

  const onSelectItem = async (data) => {
    let t = "non-history";
    if (data.t != undefined || data.t != null) {
      t = data.t;
    }
    let formValues = {
      id: data.ID,
      type: filterQuery,
      table: t,
    };
    let res = await dispatch(getPriceHistory(formValues));
    console.log(res);
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        viewModal: false,
        dataSubList: [],
        dataSubListCount: 0,
      },
    });
  };

  React.useEffect(() => {
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    });
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
    return () => cancelRequest();
  }, [search, filterQuery, warehouseQuery, rowsPerPage, dateQuery]);
  const loadMore = () => {
    if (loading) return;
    if (page >= last_page) return;

    setSearchParams({
      q: search,
      p: String(page + 1),
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
      d: dateQuery,
    });
  };

  const onChangeDateStart = (date) => {
    setSearchParams({
      q: search,
      p: String(page + 1),
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
      d: date,
    });
  };

  return {
    access,
    columns,
    active_page,
    dataList,
    dataListCount,
    page,
    type,
    viewModal,
    warehouses,
    filterQuery,
    filteredWarehouses,
    columns_history,
    dataSubList,
    rowsPerPage,
    dataSubListCount,
    last_page,
    tableRef,
    onChangeWarehouse,
    onChangeSearch,
    onChangeFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    onSelectItem,
    onClickCloseViewModal,
    loadMore,
    onChangeDateStart,
  };
};

export default PriceTrackerHooks;
