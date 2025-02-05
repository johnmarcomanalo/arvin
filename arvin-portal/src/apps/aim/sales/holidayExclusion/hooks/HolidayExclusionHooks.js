import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../api/api";
import { getAllRefHolidays } from "../../../settings/reference/actions/ReferenceActions";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import {
  getSalesDailyOutbyID,
  getSalesTrackerByDateSubsectionProduct,
} from "../../salesTracker/warehouseSales/actions/WarehouseSalesActions";
import { Constants } from "../../../../../reducer/Contants";
import { decryptaes } from "../../../../../utils/LightSecurity";
const HolidayExclusionHooks = (props) => {
  const dispatch = useDispatch();
  const holidays = useSelector((state) => state.ReferenceReducer.holidays);
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const dataList = useSelector((state) => state.SalesDailyOutReducer.dataList);
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const user_access_organization_rights =
    access.user_access_organization_rights;
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = React.useState({
    subsection: "",
  });
  const page = searchParams.get("p") != undefined ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 30;
  const filterDateQuery =
    searchParams.get("fd") != null
      ? String(searchParams.get("fd"))
      : moment(new Date()).format("YYYY-MM-DD");
  const filterSubsectionNameQuery =
    searchParams.get("fs") != null ? String(searchParams.get("fds")) : "";
  const filterSubsectionQuery =
    searchParams.get("fs") != null ? String(searchParams.get("fs")) : "";
  const columns = [
    { id: "sales_date", label: "Date", align: "left" },
    {
      id: "ref_product_groups_description",
      label: "Product Group",
      align: "left",
    },
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

  const getListParam = () => {
    const data = {
      // p: page == null ? 1 : page,
      // l: rowsPerPage,
      fd: filterDateQuery,
      fs: filterSubsectionQuery,
      fds: filterSubsectionNameQuery,
    };
    return data;
  };
  const GetSalesDailyOutDates = async () => {
    try {
      const data = await getListParam();
      dispatch(getSalesTrackerByDateSubsectionProduct(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (filterDateQuery !== "" && filterSubsectionQuery !== "") {
      GetSalesDailyOutDates();
    }
    return () => cancelRequest();
  }, [filterDateQuery, filterSubsectionQuery, refresh]);
  React.useEffect(() => {
    props.initialize({
      selected_date: filterDateQuery,
      subsection: filterSubsectionNameQuery,
    });
    return () => cancelRequest();
  }, []);
  const filterDate = (date) => {
    let filterDateQuery = moment(date).format("YYYY-MM-DD");
    setSearchParams({
      fd: filterDateQuery,
      fs: filterSubsectionQuery,
      fds: filterSubsectionNameQuery,
    });
  };
  const filterSubSections = (data) => {
    let filterSubsectionQuery = data.code;
    let filterSubsectionNameQuery = data.description;
    setSearchParams({
      fd: filterDateQuery,
      fs: filterSubsectionQuery,
      fds: filterSubsectionNameQuery,
    });
  };
  const onSelectItem = (data) => {
    const response = dispatch(getSalesDailyOutbyID(data));
    response.then((res) => {
      let sales_date = decryptaes(res.data);
      dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          selectedDataList: sales_date,
          addModal: true,
        },
      });
    });
  };
  const onClickClosnMoveSaleQuotaModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: false,
      },
    });
  };
  return {
    columns,
    dataList,
    holidays,
    user_access_organization_rights,
    filterDateQuery,
    filterSubsectionQuery,
    filterSubsectionNameQuery,
    addModal,
    selectedDataList,
    filterDate,
    filterSubSections,
    onSelectItem,
    onClickClosnMoveSaleQuotaModal,
  };
};

export default HolidayExclusionHooks;
