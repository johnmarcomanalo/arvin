import configure from "apps/configure/configure.json";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { PostDefaultServices,GetSpecificDefaultServices } from "../../../../../../services/apiService";

export const postSPRPrint = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    // const res = await PostDefaultServices(
    //   "api/spr/spr",
    //   formValues
    // );
    // await dispatch({
    //   type: Constants.ACTION_LOADING,
    //   payload: {
    //     loading: false,
    //   },
    // });
    // return res;

    const url = `api/spr/spr/?warehouse=${values.warehouse}&date_start=${values.date_start}&date_end=${values.date_end}`;

    const response = await GetSpecificDefaultServices(url); 
 

    return response; 

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
    await swal(title, message, "error");
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
