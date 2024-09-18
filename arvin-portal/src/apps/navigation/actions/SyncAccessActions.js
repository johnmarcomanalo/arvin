import { Constants } from "../../../reducer/Contants";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../services/apiService";
import { decryptaes } from "../../../utils/LightSecurity";
import configure from "../../configure/configure.json";
import swal from "sweetalert";

export const syncAccessbyUser = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices("api/users/access-sync", formValues);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    return res;
  } catch (error) {
    var title = configure.error_message.default;
    var message = "";
    if (typeof error.response.data.message !== "undefined")
      title = error.response.data.message;
    if (typeof error.response.data.errors !== "undefined") {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${value.join(", ")}`)
        .join("\n");
      message = formattedErrors;
    }
    swal(title, message, "error");
  }
};
