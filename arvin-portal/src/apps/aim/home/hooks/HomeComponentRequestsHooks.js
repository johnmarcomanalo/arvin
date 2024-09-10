import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../reducer/Contants";
const HomeComponentRequestsHooks = (props) => {
  const dispatch = useDispatch();
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
    (state) => state.HomeReducer.selectedDataList
  );

  const columns = [
    { id: "request_type", label: "Type", align: "right" },
    { id: "request_date_start", label: "Date Start", align: "right" },
    { id: "request_date_end", label: "Date End", align: "right" },
    { id: "request_status", label: "Status", align: "right" },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: Constants.ACTION_HOME,
      payload: {
        page: newPage,
      },
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_HOME,
      payload: {
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

    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
  };
};

export default HomeComponentRequestsHooks;
