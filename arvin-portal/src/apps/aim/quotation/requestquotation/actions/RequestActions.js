import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const postQuotationRequest =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/quotation/request",
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
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };
