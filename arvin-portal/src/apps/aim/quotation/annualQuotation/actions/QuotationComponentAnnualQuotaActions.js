import { get } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";

export const getCompanies = () => async (dispatch) => {
  await dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: true,
    },
  });
  const res = await get("reference/companies", dispatch);
  await dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: false,
    },
  });
  await dispatch({
    type: Constants.ACTION_REFERENCE,
    payload: {
      companies: res,
    },
  });
};
