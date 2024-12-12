import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../api/api";
import {
  getAllRefSections,
  getAllRefSubSections,
  getRefSubSections,
  getSpecificRefSubSection,
} from "../actions/ReferenceActions";
import { GetAllReferenceSections } from "./RefSectionsHooks";
import { useSearchParams } from "react-router-dom";
import { Constants } from "../../../../../reducer/Contants";

const RefSubSectionsHooks = (props) => {
  const dispatch = useDispatch();
  const subsections = useSelector(
    (state) => state.ReferenceReducer.subsections
  );
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const sections = useSelector((state) => state.ReferenceReducer.sections);
  const dataList = useSelector((state) => state.ReferenceReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
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
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
  ];
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
  const GetReferenceSubSections = (id) => {
    try {
      dispatch(getRefSubSections(id));
    } catch (error) {
      console.error(error);
    }
  };

  const GetSpecificReferenceSubSections = (id) => {
    try {
      dispatch(getSpecificRefSubSection(id));
    } catch (error) {
      console.error(error);
    }
  };
  const GetAllReferenceSubSections = async () => {
    try {
      const data = getListParam();
      await dispatch(getAllRefSubSections(data));
    } catch (error) {
      console.error(error);
    }
  };
  const GetAllReferenceSections = async () => {
    try {
      await dispatch(getAllRefSections());
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    props.initialize({
      added_by: account_details?.code,
      modified_by: account_details?.code,
    });
  }, []);
  React.useEffect(() => {
    GetAllReferenceSections();
    GetAllReferenceSubSections();
    return () => cancelRequest();
  }, [refresh, filterQuery, search, page]);
  return {
    subsections,
    refresh,
    sections,
    dataList,
    dataListCount,
    search,
    page,
    columns,
    GetReferenceSubSections,
    GetSpecificReferenceSubSections,
    handleChangePage,
    onChangeSearch,
  };
};

export default RefSubSectionsHooks;
