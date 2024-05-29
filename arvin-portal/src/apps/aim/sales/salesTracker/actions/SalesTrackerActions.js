import { Constants } from "../../../../../reducer/Contants";
import {
  GetDefaultServices,
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";
export const getSalesDailyOut = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    const response = GetSpecificDefaultServices(
      "api/salesdailyout/daily_out/get_sales_daily_out/?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&uid=" +
        values.u
    );
    response.then((res) => {
      try {
        let decrypted = decryptaes(res.data);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            dataList: decrypted.dataList.data,
            dataListCount: decrypted.dataList.total,
            report_data: decrypted.report_data,
            present_mtd_data: decrypted.present_mtd_data,
            previous_mtd_data: decrypted.previous_mtd_data,
            final_mtd_data: decrypted.final_mtd_data,
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

export const postSalesDailyOut = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/salesdailyout/daily_out",
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
      try {
        let decrypted = decryptaes(res.data);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            dataList: decrypted.dataList,
            dataListCount: decrypted.dataListCount,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const getStatusDailyTargetAndPercentageDailyTargetByDailyOut =
  (daily_out, daily_quota) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetMultiSpecificDefaultServices(
        "api/salesdailyout/daily_out/get_status_daily_target_and_percentage_daily_target_by_daily_out",
        [daily_out, daily_quota]
      );
      response.then((res) => {
        let decypted = decryptaes(res.data);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            status_daily_target: decypted.status_daily_target,
            percentage_daily_target: decypted.percentage_daily_target,
          },
        });

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
