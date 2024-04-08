import { HomeConstants } from "../apps/aim/home/constants/Constants";
const initialState = {
  refresh: false,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case HomeConstants.ACTION_HOME:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
