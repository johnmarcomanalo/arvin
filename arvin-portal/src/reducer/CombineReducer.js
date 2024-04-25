import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import NavigationReducer from "./NavigationReducer";
import HomeReducer from "./HomeReducer";
import QuotationReducer from "./QuotationReducer";
import LoadingReducer from "./LoadingReducer";
import ReferenceReducer from "./ReferenceReducer";
import AuthenticationReducer from "./AuthenticationReducer";
export default combineReducers({
  NavigationReducer: NavigationReducer,
  HomeReducer: HomeReducer,
  QuotationReducer: QuotationReducer,
  ReferenceReducer: ReferenceReducer,
  LoadingReducer: LoadingReducer,
  AuthenticationReducer: AuthenticationReducer,
  form: formReducer,
});
