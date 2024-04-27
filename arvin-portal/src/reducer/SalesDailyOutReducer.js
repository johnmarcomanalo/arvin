import { Constants } from "./Contants";
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
  annual_sales_target: null,
  monthly_sales_target: null,
  daily_sales_target: null,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_SALES_DAILY_OUT:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
