import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "apps/configure/configure.json";

export const getSalesQoutedProducts = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = await GetSpecificDefaultServices(
      "api/quotation/report/quoted_products/get_report_quoted_products?p=" +
        values.p +
        "&l=" +
        values.l +
        "&q=" +
        values.q +
        "&u=" +
        values.u
    );
    let decrypted = decryptaes(response.data);
    await dispatch({
      type: Constants.ACTION_QUOTATION,
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
