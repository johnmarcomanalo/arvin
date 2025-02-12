import { Constants } from "./Contants";
const initialState = {
  refresh: false,
  refresh2: false,
  search: "",
  page: 1,
  rowsPerPage: 30,
  dataList: [],
  dataSubList: [],
  dataListCount: 0,
  dataSubListCount: 0,
  filter: "",
  dateFilter: new Date(),
  dateFilterStart: new Date(),
  dateFilterEnd: new Date(),
  selectedDataList: [],
  selectedItem:{},
  addModal: false,
  report_data: [], 
  addModal2: false,
  selected_code: null,
  editModal: false,
  viewModal: false,
  viewModal2: false,
  reportData:[]
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_EPAY_CHECK:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
