import { Constants } from "../../../../../../reducer/Contants";
import {
  GetDefaultServices,
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../../services/apiService";
import swal from "sweetalert";
import configure from "../../../../../configure/configure.json";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import { AuthGetReferencesChild } from "../../../../settings/reference/services/referenceServices";
export const getSalesDailyOut = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    const response = GetSpecificDefaultServices(
      "api/salesdailyout/sales_tracker/get_sales_tracker/?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&uid=" +
        values.u +
        "&sc=" +
        values.sc +
        "&pg=" +
        values.pg
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
            final_ytd_data: decrypted.final_ytd_data,
            ytdTotalDailyOutAmount: decrypted.ytdTotalDailyOutAmount,
            ytdTotalDailyQoutaAmount: decrypted.ytdTotalDailyQoutaAmount,
            today_data: decrypted.today_data,
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
        swal(title, message, "error");
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
      }
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
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
        swal(title, message, "error");
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
      }
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
        "api/salesdailyout/sales_tracker/get_status_daily_target_and_percentage_daily_target_by_daily_out",
        [daily_out, daily_quota]
      );
      // response.then((res) => {
      //   // let decypted = decryptaes(res.data);
      //   dispatch({
      //     type: Constants.ACTION_SALES_DAILY_OUT,
      //     payload: {
      //       status_daily_target: res.status_daily_target,
      //       percentage_daily_target: res.percentage_daily_target,
      //     },
      //   });
      return response;

      // });
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
    } finally {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

export const getSalesTrackerByDateSubsectionProduct =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetSpecificDefaultServices(
        "api/salesdailyout/sales_tracker/get_sales_tracker_by_date_subsection_product/?fd=" +
          formValues.fd +
          "&fs=" +
          formValues.fs
      );
      response.then((res) => {
        let decypted = decryptaes(res.data);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            dataList: decypted.dataList,
          },
        });
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

export const getSalesDailyOutbyID = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = await GetMultiSpecificDefaultServices(
      "api/salesdailyout/sales_tracker/get_sales_daily_out_per_day",
      [values.sales_date, values.sales_daily_out_annual_settings_sales_code]
    );
    return response;
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
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};

export const postMoveSalePerDay = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/salesdailyout/holiday_exclusions/move_sales_per_day",
      formValues
    );
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: false,
      },
    });
    return res;
  } catch (error) {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    var title = configure.error_message.default;
    var message = "";
    if (error.response && error.response.data) {
      if (error.response.data.message) title = error.response.data.message;
      if (error.response.data.errors) {
        const formattedErrors = Object.entries(error.response.data.errors)
          .map(([key, value]) => `${value.join(", ")}`)
          .join("\n");
        message = formattedErrors;
      }
    }
    await swal(title, message, "error");
  } finally {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
