import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import NavigationReducer from "./NavigationReducer";
import HomeReducer from "./HomeReducer";
export default combineReducers({
  NavigationReducer: NavigationReducer,
  HomeReducer: HomeReducer,
  form: formReducer,
});
