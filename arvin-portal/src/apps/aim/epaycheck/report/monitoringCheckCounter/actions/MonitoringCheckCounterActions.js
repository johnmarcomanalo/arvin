import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "apps/configure/configure.json";

export const getMonitoringCheckCounterData = (formValues) => async (dispatch) => {
  try {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: true },
    });

    // Ensure await is correctly used
    const response = await GetSpecificDefaultServices(
      `api/epaycheck/report/get_monitoring_check_counter?df=${formValues.df}&dt=${formValues.dt}&sc=${formValues.sc}&st=${formValues.st}`
    );
    const decrypted = decryptaes(response?.data);
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: { reportData: decrypted },
    });

  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }
    
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
    
    await swal(title, message, status);
  } finally {
    // Ensure loading state is reset even if an error occurs
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
  }
};
