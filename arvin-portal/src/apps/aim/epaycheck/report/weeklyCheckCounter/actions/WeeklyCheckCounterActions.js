import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "../../../../../configure/configure.json";

export const getWeeklyChecCounterData = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const results = GetSpecificDefaultServices(
      "api/epaycheck/check_detail_logs/get_weekly_check_counter_data?df=" +
        formValues.df +
        "&dt=" +
        formValues.dt +
        "&sc=" +
        formValues.sc
    );
    results.then((res) => {  
      let decrypted = decryptaes(res?.data)
      let data = decrypted
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              reportData: data,
            },
        });
    }); 
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
    setTimeout(() => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    },2000)
  } finally {
    setTimeout(() => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    },2000)
  }
};
