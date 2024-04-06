import { combineReducers } from "redux";
import NavigationReducer from "./NavigationReducer";
import { reducer as formReducer } from "redux-form";

export default combineReducers({
  NavigationReducer: NavigationReducer,
  form: formReducer,
});
