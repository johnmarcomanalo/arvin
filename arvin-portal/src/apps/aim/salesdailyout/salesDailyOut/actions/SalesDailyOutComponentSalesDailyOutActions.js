import { get, post, postNoToken } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
  GetDefaultServices,
  GetMultiSpecificDefaultServices,
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
        console.log(decrypted);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            dataList: decrypted.dataList.data,
            dataListCount: decrypted.dataList.total,
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

// export const getAnnualMonthlyDailyTargetSalesBySectionSubsection =
//   (type, id, year) => async (dispatch) => {
//     try {
//       await dispatch({
//         type: Constants.ACTION_LOADING,
//         payload: {
//           loading: true,
//         },
//       });
//       const response = await GetMultiSpecificDefaultServices(
//         "api/salesdailyout/annual_settings_sales/get_annual_monthly_daily_target_sales_by_section_subsection/",
//         [type, id, year]
//       );
//       response.then((res) => {
//         try {
//           // let decypted = decryptaes(res.data);
//           // dispatch({
//           //   type: Constants.ACTION_SALES_DAILY_OUT,
//           //   payload: {
//           //     annual_sales_target: decypted.annual_sales_target,
//           //     monthly_sales_target: decypted.monthly_sales_target,
//           //     daily_sales_target: decypted.daily_sales_target,
//           //   },
//           // });
//         } catch (error) {
//           console.log(error);
//         }
//         dispatch({
//           type: Constants.ACTION_LOADING,
//           payload: {
//             loading: false,
//           },
//         });
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

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
