import { get, post, postNoToken } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
  GetDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const monthlyAndDailyQoutaByTargetAnnualSales =
  (amount) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetSpecificDefaultServices(
        "api/salesdailyout/annual_qouta/annual_qouta_computation/",
        amount
      );
      response.then((res) => {
        try {
          let decypted = decryptaes(res.data);
          dispatch({
            type: Constants.ACTION_SALES_DAILY_OUT,
            payload: {
              annual_sales_target: decypted.annual_sales_target,
              monthly_sales_target: decypted.monthly_sales_target,
              daily_sales_target: decypted.daily_sales_target,
            },
          });
        } catch (error) {
          console.log(error);
        }
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

export const postAnnualTargetSales = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/salesdailyout/annual_settings_sales",
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

export const getAnnualSettingSale = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetDefaultServices(
      "api/salesdailyout/annual_settings_sales"
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
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          dataList: decrypted.dataList,
          dataListCount: decrypted.dataListCount,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};
