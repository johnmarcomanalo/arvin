import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import { cancelRequest } from "../../../../../api/api";
const PageRightsHooks = (props) => {
  const dispatch = useDispatch();
  const HRrefresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const search = useSelector((state) => state.HomeReducer.search);
  const page = useSelector((state) => state.HomeReducer.page);
  const rowsPerPage = useSelector((state) => state.HomeReducer.rowsPerPage);
  const dataList = useSelector((state) => state.HomeReducer.dataList);
  const dataListCount = useSelector((state) => state.HomeReducer.dataListCount);
  const dateFilterStart = useSelector(
    (state) => state.HomeReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector((state) => state.HomeReducer.dateFilterEnd);
  const selectedDataList = useSelector(
    (state) => state.HumanResourceReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const viewModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
  const columns = [
    { id: "module", label: "Module", align: "left" },
    { id: "component", label: "Component", align: "left" },
    { id: "subcomponent", label: "Subcomponent", align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_HOME,
      data: {
        page: newPage,
      },
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_HOME,
      data: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const onSelectItem = (data) => {
    console.log(data);
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onClickOpenViewModal = () => {
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
  React.useEffect(() => {
    props.initialize({
      user_code: selectedDataList?.code,
      username: selectedDataList?.username,
      full_name: selectedDataList?.full_name,
    });
    return () => cancelRequest();
  }, [HRrefresh]);
  return {
    search,
    page,
    dataList,
    rowsPerPage,
    dataListCount,
    dateFilterStart,
    dateFilterEnd,
    selectedDataList,
    columns,
    account_details,
    viewModal,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onClickOpenViewModal,
    onClickCloseViewModal,
  };
};

export default PageRightsHooks;
