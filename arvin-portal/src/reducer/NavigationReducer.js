import { Constants } from "./Contants";
const initialState = {
  request_modal: false,
  refresh: false,
  request_type: "",
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_NAVIGATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
