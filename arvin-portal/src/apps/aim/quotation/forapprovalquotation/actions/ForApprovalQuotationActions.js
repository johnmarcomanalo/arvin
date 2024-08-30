import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getForApprovalSalesQuotation = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/quotation/for_approval_quotation/get_request_for_approval?p=" +
        values.p +
        "&l=" +
        values.l +
        "&q=" +
        values.q +
        "&fs=" +
        values.fs +
        "&fe=" +
        values.fe +
        "&u=" +
        values.u
    );
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      let decrypted = decryptaes(res.data);
      dispatch({
        type: Constants.ACTION_QUOTATION,
        payload: {
          dataList: decrypted.dataList,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const postForApprovalSalesQuotation =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/quotation/for_approval_quotation",
        formValues
      );
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      console.log(decryptaes(res.data));
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
