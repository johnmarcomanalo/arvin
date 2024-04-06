import { NavigationContants } from "../apps/navigation/constants/Constants"
const initialState = {
  wishlist_modal: false,
  refresh: false,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case NavigationContants.ACTION_NAVIGATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
