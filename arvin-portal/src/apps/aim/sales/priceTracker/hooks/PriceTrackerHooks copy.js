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
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "Manila";
  const warehouseQuery =
    searchParams.get("w") != null ? String(searchParams.get("w")) : "";
  const json_active_page = useSelector(
    (state) => state.AuthenticationReducer.active_page,
  );
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
    });
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      w: warehouseQuery,
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
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      q: search,
      p: page,
      l: String(rowsPerPage),
      f: filterQuery,
      w: warehouseQuery,
    });
  };
  const handleChangeRowsPerPage = (limitpage) => {
    const lpage = limitpage;
    setSearchParams({
      q: search,
      p: page,
      l: String(lpage),
      f: filterQuery,
      w: warehouseQuery,
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
  }, [refresh, filterQuery, search, page, warehouseQuery]);

  const onSelectItem = async (data) => {
    let formValues = {
      id: data.ID,
      type: filterQuery,
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
    props.initialize({
      type: filterQuery,
    });
    return () => cancelRequest();
  }, []);
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
    onChangeWarehouse,
    onChangeSearch,
    onChangeFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    onSelectItem,
    onClickCloseViewModal,
  };
};

export default PriceTrackerHooks;
