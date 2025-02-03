import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "../../../../../configure/configure.json";

export const getWeeklyChecCounterkData = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const results = GetSpecificDefaultServices(
      "api/epaycheck/check_details/get_weekly_check_counter_data?q=" +
        formValues.q +
        "&p=" +
        formValues.p +
        "&df=" +
        formValues.df +
        "&dt=" +
        formValues.dt +
        "&s=" +
        formValues.s +
        "&sc=" +
        formValues.sc
    );
    results.then((res) => {  
      let decrypted = decryptaes(res?.data)
      let data = decrypted?.dataList; 
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              dataList: data, 
              dataListCount: decrypted.total,
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
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } finally {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
