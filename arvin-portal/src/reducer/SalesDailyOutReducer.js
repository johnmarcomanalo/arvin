import { Constants } from "./Contants";
const initialState = {
  refresh: false,
  refresh2: false,
  search: "",
  page: 1,
  rowsPerPage: 30,
  dataList: [],
  dataList2: [],
  dataSubList: [],
  dataListCount: 0,
  dataListCount2: 0,
  dataSubListCount: 0,
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
  addModal2: false,
  selected_code: null,
  target_point: 0,
  addModal3: false,
  addModal4: false,
  final_ytd_data: 0,
  showTableCards: false,
  annual_sales_mtd_ytd_subsections: [],
  annual_sales_out_summary: [],
  current_sales_mtd_ytd_subsections: [],
  yearly_sales_line_chart_summary: [],
  total_daily_out_amount: 0,
  showMTDTable: false,
  showYTDTable: false,
  annual_set_total_count_subsections: 0,
  annual_set_subsections: [],
  filterModal: false,
  ytdTotalDailyOutAmount: 0,
  ytdTotalDailyQoutaAmount: 0,
  today_data: [],
  editModal: false,
  get_today_sales: [],
  client_groups: [],
  showprovTable: true,
  showbdoTable: false,
  updateModal: false,
  borrow_data: [],
  spr: [],
  viewModal: false
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
