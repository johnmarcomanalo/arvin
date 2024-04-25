import { Constants } from "./Contants";
const storedUserData = localStorage.getItem("userData");
const initialState = {
  token: "",
  user: storedUserData ? JSON.parse(storedUserData) : null,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_AUTHENTICATION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
