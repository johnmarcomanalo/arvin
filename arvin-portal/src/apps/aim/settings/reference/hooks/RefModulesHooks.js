import { useDispatch, useSelector } from "react-redux";
import * as React from "react";
import { cancelRequest } from "../../../../../api/api";
import { useSearchParams } from "react-router-dom";
import { getReferenceModule } from "../actions/ReferenceActions";
import moment from "moment";
import { Constants } from "../../../../../reducer/Contants";
const RefModulesHooks = (props) => {
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const dataList = useSelector((state) => state.ReferenceReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "link", label: "Link", align: "left" },
  ];
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
    searchParams.get("f") != null ? String(searchParams.get("f")) : "";
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
      type: Constants.ACTION_REFERENCE,
      payload: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const getRefModule = async () => {
    try {
      const data = getListParam();
      await dispatch(getReferenceModule(data));
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    props.initialize({
      added_by: account_details?.code,
      modified_by: account_details?.code,
    });
    return () => cancelRequest();
  }, [refresh]);

  React.useEffect(() => {
    getRefModule();
    return () => cancelRequest();
  }, [refresh, filterQuery, search, page]);
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

export default RefModulesHooks;
