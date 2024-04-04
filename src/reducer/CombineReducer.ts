import { combineReducers } from "redux";
import ReferenceReducer from "./ReferenceReducer";
import { reducer as formReducer } from "redux-form";

export default combineReducers({
  ReferenceReducer: ReferenceReducer,
  form: formReducer,
});
