import { Constants } from "../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../services/apiService";

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
