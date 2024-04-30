import { decryptLocal } from "../utils/Encryption";
import { decryptaes } from "../utils/LightSecurity";
import { Constants } from "./Contants";
const storedUserData = localStorage.getItem("account_details");
const initialState = {
  token: "",
  account_details: storedUserData ? decryptaes(storedUserData) : null,
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
