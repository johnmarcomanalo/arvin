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
  selectedDataRow: [],
  addModal: false,
  sap:"",
  monitoring: "",
  selected_code: null,  
  editModal: false,
  get_today_sales: [],
  client_groups: [],
  showprovTable: true,
  showbdoTable: false,
  updateModal: false,
  borrow_data: [],
  barChartData:[],
  LineChartData:[],
  PieChartData:[],
  monitoringData:[],
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_LOGISTIC:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
