import { HomeConstants } from "../apps/aim/home/constants/Constants";
const initialState = {
  refresh: false,
  search: "",
  page: 0,
  rowsPerPage: 10,
  dataList: [],
  dataListCount: 0,
  filter: "",
  dateFilterStart: "",
  dateFilterEnd: "",
  selectedDataList: [],
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case HomeConstants.ACTION_HOME:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
