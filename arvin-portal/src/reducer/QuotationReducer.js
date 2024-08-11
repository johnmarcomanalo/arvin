import { Constants } from "./Contants";
import moment from "moment";
const initialState = {
  refresh: false,
  search: "",
  page: 0,
  rowsPerPage: 10,
  productList: [],
  dataList: [],
  dataListCount: 0,
  filter: "",
  dateFilterStart: new Date(),
  dateFilterEnd: new Date(),
  selectedDataList: [],
  addModal: false,
  viewModal: false,
  updateModal: false,
  target_annual_quota: null,
  target_month_quota: null,
  target_day_quota: null,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_QUOTATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
