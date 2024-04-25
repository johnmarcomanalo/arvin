import { get, post, postNoToken } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
export const monthlyAndDailyQoutaByAnnualQouta =
  (amount) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await get(
        "qoutation/annual_qouta/annual_qouta_computation/" + amount
      );
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      await dispatch({
        type: Constants.ACTION_QUOTATION,
        payload: {
          target_annual_quota: res.annual_qouta,
          target_month_quota: res.monthy_qouta,
          target_day_quota: res.daily_qouta,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

export const postAnnualQouta = (formValues) => async (dispatch) => {
  // await dispatch({
  //   type: Constants.ACTION_LOADING,
  //   payload: {
  //     loading: true,
  //   },
  // });
  const res = await post("qoutation/annual_qouta", formValues);
  await dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: false,
    },
  });
  return res;
};
