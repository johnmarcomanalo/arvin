import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import NavigationReducer from "./NavigationReducer";
import HomeReducer from "./HomeReducer";
import QuotationReducer from "./QuotationReducer";
import LoadingReducer from "./LoadingReducer";
import ReferenceReducer from "./ReferenceReducer";
import AuthenticationReducer from "./AuthenticationReducer";
import SalesDailyOutReducer from "./SalesDailyOutReducer";
import HumanResourceReducer from "./HumanResourceReducer";
import EpayCheckReducer from "./EpayCheckReducer";

export default combineReducers({
  HumanResourceReducer: HumanResourceReducer,
  NavigationReducer: NavigationReducer,
  HomeReducer: HomeReducer,
  QuotationReducer: QuotationReducer,
  ReferenceReducer: ReferenceReducer,
  LoadingReducer: LoadingReducer,
  AuthenticationReducer: AuthenticationReducer,
  SalesDailyOutReducer: SalesDailyOutReducer,
  EpayCheckReducer: EpayCheckReducer,
  form: formReducer,
});
