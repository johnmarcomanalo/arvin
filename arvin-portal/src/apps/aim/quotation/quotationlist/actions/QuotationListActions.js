import { Constants } from "../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getSalesQuotations = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/quotation/request/get_request_quotation?p=" +
        values.p +
        "&l=" +
        values.l +
        "&q=" +
        values.q +
        "&fs=" +
        values.fs +
        "&fe=" +
        values.fe +
        "&st=" +
        values.st +
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

export const ViewSalesQuotation = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await GetSpecificDefaultServices("api/quotation/request/", id);
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
