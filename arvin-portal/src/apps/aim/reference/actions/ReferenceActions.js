import { Constants } from "../../../../reducer/Contants";
import { get, fetch } from "../../../../api/api";
import { decryptLocal } from "../../../../utils/Encryption";
export const getRefCompanies = () => async (dispatch) => {
  // await dispatch({
  //   type: Constants.ACTION_LOADING,
  //   payload: {
  //     loading: true,
  //   },
  // });
  const res = await get("reference/companies");

  await dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: false,
    },
  });
  // await dispatch({
  //   type: Constants.ACTION_REFERENCE,
  //   payload: {
  //     companies: res,
  //   },
  // });
};
