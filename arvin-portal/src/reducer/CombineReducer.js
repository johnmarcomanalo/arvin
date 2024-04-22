import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import NavigationReducer from "./NavigationReducer";
import HomeReducer from "./HomeReducer";
import QuotationReducer from "./QuotationReducer";
export default combineReducers({
  NavigationReducer: NavigationReducer,
  HomeReducer: HomeReducer,
  QuotationReducer: QuotationReducer,
  form: formReducer,
});
