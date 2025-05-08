import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import configure from "apps/configure/configure.json";

export const geClientSalesSummaryReport = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = await GetSpecificDefaultServices(
      "api/salesdailyout/report/get_client_sales_tracker_summary?year=" +
        formValues.year +
        "&product=" +
        formValues.product +
        "&group_code=" +
        formValues.group_code +
        "&bdo=" +
        formValues.bdo +
        "&type=" +
        formValues.group_code +
        "&subsection=" +
        formValues.bdo
    );
    let decrypted = decryptaes(response.data);
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        dataList: decrypted.dataList,
        dataListCount: decrypted.dataListCount,
      },
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
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
