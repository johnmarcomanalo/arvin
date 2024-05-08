import { Constants } from "./Contants";
const initialState = {
  refresh: false,
  search: "",
  page: 1,
  rowsPerPage: 10,
  dataList: [],
  dataListCount: 0,
  filter: "",
  dateFilter: new Date(),
  dateFilterStart: new Date(),
  dateFilterEnd: new Date(),
  selectedDataList: [],
  addModal: false,
  annual_sales_target: null,
  monthly_sales_target: null,
  daily_sales_target: null,
  status_daily_target: null,
  percentage_daily_target: null,
  year_sales_target: null,
  sales_daily_out_annual_settings_sales_code: null,
  report_data: [],
  present_mtd_data: [],
  previous_mtd_data: [],
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
