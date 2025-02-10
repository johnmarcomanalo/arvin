
import { Constants } from "../../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
  PutDefaultServices,
} from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "../../../../configure/configure.json";
export const getCheckDetails = (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
       
        const results = GetSpecificDefaultServices(
          "api/epaycheck/get_check_details?q=" +
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


export const postCheckDetailsStatus = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/epaycheck/check_details/update_check_status",
      formValues
    );  
  
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    }); 
    
    let decrypted = decryptaes(res?.data)
    return decrypted;
  } catch (error) {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
 

export const putCheckMonitoring = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PutDefaultServices(
      "api/epaycheck/check_details/",
      formValues.code,
      formValues
    );
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
    await swal(title, message, "error");
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
