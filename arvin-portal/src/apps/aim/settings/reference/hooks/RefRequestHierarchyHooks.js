import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import {
  getAllRefRequestTypes,
  getReferenceRequestHierarchy,
  getSpecificReferenceRequestHierarchy,
} from "../actions/ReferenceActions";
const RefRequestHierarchyHooks = (props) => {
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const selected_ref = useSelector(
    (state) => state.ReferenceReducer.selected_ref
  );
  const request_types = useSelector(
    (state) => state.ReferenceReducer.request_types
  );
  const viewSelectedRefModal = useSelector(
    (state) => state.ReferenceReducer.viewSelectedRefModal
  );
  const dataList = useSelector((state) => state.ReferenceReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.ReferenceReducer.dataListCount
  );
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "description", label: "Description", align: "left" },
    { id: "description", label: "Description", align: "left" },
  ];
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    hierarchy: [{ index: 1, approver: [], status: "Pending" }],
    index_level: null,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null ? String(searchParams.get("f")) : "";
  const viewModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
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
  const getAllRefenceRequestHierarchy = async () => {
    try {
      let data = getListParam();
      await dispatch(getReferenceRequestHierarchy(data));
      await dispatch(getAllRefRequestTypes());
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
    getAllRefenceRequestHierarchy();
    return () => cancelRequest();
  }, [refresh, filterQuery, search, page]);

  const onChangeHierarchyLevelDescription = (event, index) => {
    let valu = event.target.value;
    let target_name = event.target.name;
    let name = target_name.split("-")[0];
    setState((prev) => ({
      ...prev,
      hierarchy: state.hierarchy.map((val, index2) =>
        index === index2 ? { ...val, [name]: valu } : val
      ),
    }));
  };

  const onClickAddHierarchyLevel = () => {
    let level = {
      index: state.hierarchy.length + 1,
      approver: [],
      status: "Pending",
    };
    state.hierarchy.push(level);
    setState((prev) => ({
      ...prev,
    }));
  };

  const onClickRemoveHierarchyLevel = () => {
    state.hierarchy.splice(state.hierarchy.length - 1, 1);
    setState((prev) => ({
      ...prev,
    }));
  };

  const onClickOpenViewModal = (index) => {
    setState((prev) => ({
      ...prev,
      index_level: index,
    }));
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: false,
      },
    });
  };
  const onSelectApprover = (data) => {
    const updatedHierarchy = state.hierarchy.map((item, index) => {
      if (index === state.index_level) {
        // Check if approver property exists and is an array
        const updatedApprover = Array.isArray(item.approver)
          ? [...item.approver, data]
          : [data];
        return { ...item, approver: updatedApprover }; // Update the approver for the selected index
      }
      return item; // Keep other items unchanged
    });
    setState((prevState) => ({
      ...prevState,
      hierarchy: updatedHierarchy,
    }));
  };

  const onRemoveApprover = (data) => {
    const updatedHierarchy = state.hierarchy.map((item, index) => {
      if (index === state.index_level) {
        // Check if approver property exists and is an array
        const updatedApprover = Array.isArray(item.approver)
          ? item.approver.filter((approver) => approver !== data)
          : [];
        return { ...item, approver: updatedApprover }; // Update the approver for the selected index
      }
      return item; // Keep other items unchanged
    });
    setState((prevState) => ({
      ...prevState,
      hierarchy: updatedHierarchy,
    }));
  };
  const onSelectItem = async (data) => {
    try {
      await dispatch(getSpecificReferenceRequestHierarchy(data.code));
      await dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          viewSelectedRefModal: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onClickCloseRefViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewSelectedRefModal: false,
      },
    });
  };
  return {
    account_details,
    search,
    page,
    dataList,
    dataListCount,
    columns,
    rowsPerPage,
    request_types,
    state,
    viewModal,
    viewSelectedRefModal,
    selected_ref,
    onChangeSearch,
    getListParam,
    onChangeFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    onChangeHierarchyLevelDescription,
    onClickAddHierarchyLevel,
    onSelectApprover,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onRemoveApprover,
    onClickRemoveHierarchyLevel,
    onSelectItem,
    onClickCloseRefViewModal,
  };
};

export default RefRequestHierarchyHooks;
