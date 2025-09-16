import configure from "apps/configure/configure.json";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import {
  GetDefaultServices,
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
export const getClientSalesTracker = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: true },
    });

    const url = `api/salesdailyout/sales_tracker/client/client_sales_summary/?
    y=${values.y}
    &m=${values.m}
    &pr=${values.pr}
    &c=${values.c}
    &b=${values.b}
    &t=${values.t}
    &w=${values.w}
    &tl=${values.tl}
    &tp=${values.tp}
    &tr=${values.tr}`;

    const response = await GetSpecificDefaultServices(url); 
    
    const decrypted_week= decryptaes(response.data.week); 
    const decrypted_month = decryptaes(response.data.month); 
    const { data, total } = decrypted_week.dataList;  

    if (values.tp && values.tl) {
      await dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          dataList: data,
          dataListCount: total, 
          dataList2: decrypted_month.dataList?.data,
          dataListCount2: decrypted_month.dataList?.total,
        },
      });
    } else {
      return decrypted_week;
    }
  } catch (error) {
    var title = configure.error_message.default;
    var message = "";
    if (typeof error.response.data.message !== "undefined")
      title = error.response.data.message;
    if (typeof error.response.data.errors !== "undefined") {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${value.join(", ")}`)
        .join("\n");
      message = formattedErrors;
    }
    await swal(title, message, "error");
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};


export const getClientSalesTrackerDataReport = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: true },
    });

    const url = `api/salesdailyout/sales_tracker/client/client_sales_summary_report_data/?
    y=${values.y}
    &m=${values.m}
    &pr=${values.pr}
    &c=${values.c}
    &b=${values.b}
    &t=${values.t}
    &w=${values.w}
    &tr=${values.tr}`;

    const response = await GetSpecificDefaultServices(url); 
    
    const decrypted= decryptaes(response.data);

      await dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          report_data:decrypted
        },
      });
  } catch (error) {
    var title = configure.error_message.default;
    var message = "";
    if (typeof error.response.data.message !== "undefined")
      title = error.response.data.message;
    if (typeof error.response.data.errors !== "undefined") {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${value.join(", ")}`)
        .join("\n");
      message = formattedErrors;
    }
    await swal(title, message, "error");
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};







// export const geClientSalesSummaryReport = (formValues) => async (dispatch) => {
//   try {
//     await dispatch({
//       type: Constants.ACTION_LOADING,
//       payload: {
//         loading: true,
//       },
//     });
    
//     const response = await GetSpecificDefaultServices(
//       "api/salesdailyout/report/get_client_sales_tracker_summary?year=" +
//         formValues.year +
//         "&product=" +
//         formValues.product +
//         "&group_code=" +
//         formValues.group_code +
//         "&bdo=" +
//         formValues.bdo +
//         "&t=" +
//         formValues.t +
//         "&w=" +
//         formValues.w +
//         "&tp=" +
//         formValues.tp +
//         "&tl=" +
//         formValues.tl+
//         "&x=" +
//         formValues.x
//     );
//     let decrypted = decryptaes(response.data); 
    
//     dispatch({
//       type: Constants.ACTION_SALES_DAILY_OUT,
//       payload: {
//         dataList2: decrypted?.dataList.data,
//         dataListCount2: decrypted.dataList?.total,
//       },
//     });


//   } catch (error) {
//     var title = configure.error_message.default;
//     var message = "";
//     if (typeof error.response.data.message !== "undefined")
//       title = error.response.data.message;
//     if (typeof error.response.data.errors !== "undefined") {
//       const formattedErrors = Object.entries(error.response.data.errors)
//         .map(([key, value]) => `${value.join(", ")}`)
//         .join("\n");
//       message = formattedErrors;
//     }

//     await swal(title, message, "error");
//   } finally {
//     await dispatch({
//       type: Constants.ACTION_LOADING,
//       payload: {
//         loading: false,
//       },
//     });
//   }
// };