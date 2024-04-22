import { Constants } from "./Contants";
import moment from "moment";
const initialState = {
  refresh: false,
  search: "",
  page: 0,
  rowsPerPage: 10,
  dataList: [],
  dataListCount: 0,
  filter: "",
  dateFilterStart: new Date(),
  dateFilterEnd: new Date(),
  selectedDataList: [],
  addModal: false,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_Quotation:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
