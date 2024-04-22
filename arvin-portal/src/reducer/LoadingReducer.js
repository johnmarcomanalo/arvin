import { Constants } from "./Contants";
const initialState = {
  loading: false,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_LOADING:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
