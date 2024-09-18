import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { getRefProducts } from "../actions/ReferenceActions";
import { encryptaes } from "../../../../../utils/LightSecurity";
const RefProductsHooks = (props) => {
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const dataList = useSelector((state) => state.ReferenceReducer.productList);
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "weight", label: "Weight (Kg)", align: "left" },
    { id: "tax_code", label: "Tax Code", align: "left" },
    { id: "brand", label: "Brand", align: "left" },
    { id: "branch", label: "Branch", align: "left" },
    { id: "groups", label: "Groups", align: "left" },
  ];
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("pg") != null ? searchParams.get("pg") : 1;
  const rowsPerPage =
    searchParams.get("lmt") != null ? searchParams.get("lmt") : 10;
  const search =
    searchParams.get("srch") != null ? String(searchParams.get("srch")) : "";
  const taxCodeQuery =
    searchParams.get("tc") != null ? String(searchParams.get("tc")) : "";
  const brandQuery =
    searchParams.get("brnd") != null ? String(searchParams.get("brnd")) : "";
  const branchQuery =
    searchParams.get("brnch") != null ? String(searchParams.get("brnch")) : "";
  const groupQuery =
    searchParams.get("grps") != null ? String(searchParams.get("grps")) : "";
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      pg: "1",
      srch: search,
      lmt: rowsPerPage,
      tc: taxCodeQuery,
      brnd: brandQuery,
      brnch: branchQuery,
      grps: groupQuery,
      u: encryptaes(account_details?.code),
    });
  };
  const getListParam = () => {
    const data = {
      pg: page == null ? 1 : page,
      srch: search,
      lmt: rowsPerPage,
      tc: taxCodeQuery,
      brnd: brandQuery,
      brnch: branchQuery,
      grps: groupQuery,
      u: encryptaes(account_details?.code),
    };
    return data;
  };
  const onChangeFilter = (data, type) => {
    let filter = data;
    switch (type) {
      case "tax":
        taxCodeQuery = filter;
        break;
      case "brand":
        brandQuery = filter;
        break;
      case "branch":
        branchQuery = filter;
        break;
      case "groups":
        groupQuery = filter;
        break;
      default:
        search = filter;
        break;
    }
    setSearchParams({
      pg: "1",
      srch: search,
      lmt: rowsPerPage,
      tc: taxCodeQuery,
      brnd: brandQuery,
      brnch: branchQuery,
      grps: groupQuery,
      u: encryptaes(account_details?.code),
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      pg: page,
      srch: search,
      lmt: String(rowsPerPage),
      tc: taxCodeQuery,
      brnd: brandQuery,
      brnch: branchQuery,
      grps: groupQuery,
      u: encryptaes(account_details?.code),
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const getProducts = async () => {
    try {
      const data = getListParam();
      await debounce(() => {
        dispatch(getRefProducts(data));
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    getProducts();
    return () => cancelRequest();
  }, [search, page, refresh]);
  return {
    account_details,
    search,
    page,
    dataList,
    dataListCount,
    columns,
    rowsPerPage,
    onChangeSearch,
    getListParam,
    onChangeFilter,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};

export default RefProductsHooks;
