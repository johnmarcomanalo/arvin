import { Constants } from "./Contants";
const initialState = {
  viewModal: false,
  uploadModal: false,
  refresh: false,
  search: "",
  page: 0,
  rowsPerPage: 10,
  dataList: [],
  searchdataList: [],
  dataListCount: 0,
  searchdataListCount: 0,
  filter: "",
  dateFilterStart: new Date(),
  dateFilterEnd: new Date(),
  selectedDataList: null,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_HUMAN_RESOURCE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
