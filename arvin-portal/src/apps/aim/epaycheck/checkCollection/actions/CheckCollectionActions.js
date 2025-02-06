import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "../../../../configure/configure.json";
export const getSalesInvoiceDetails = (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
    const results = GetSpecificDefaultServices(
        "api/epaycheck/get_sales_invoice_list?c=" +
          formValues.c +
          "&d=" +
          formValues.d +
          "&q=" +
          formValues.q +
          "&p=" +
          formValues.p
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
      let title = configure.error_message.default;
      let message = "";
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
}

export const postCheckCollection = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices("api/epaycheck/check_details", formValues);
   
    return res;
  } catch (error) {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
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
  }
};
