import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "../../../../configure/configure.json";

export const getMonthlyAndDailyQoutaByTargetAnnualSales =
  (amount) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetSpecificDefaultServices(
        "api/salesdailyout/annual_settings_sales/annual_target_sales_computation/",
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

export const postSettingsAnnualQuotaClientGroups =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/salesdailyout/settings_quota_groups",
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

export const getAnnualSettingSaleClientGroups = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/settings_quota_groups/annual_quota_client_groups?page=" +
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
          dataList: decrypted.dataList.data,
          dataListCount: decrypted.dataList.total,
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

export const getAnnualMonthlyDailyTargetSalesBySectionSubsection =
  (id, year) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetMultiSpecificDefaultServices(
        "api/salesdailyout/annual_settings_sales/get_annual_monthly_daily_target_sales_by_section_subsection",
        [id, year]
      );
      response.then((res) => {
        let decypted = decryptaes(res.data);

        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            annual_sales_target: decypted.annual_sales_target,
            monthly_sales_target: decypted.monthly_sales_target,
            daily_sales_target: decypted.daily_sales_target,
            year_sales_target: decypted.year_sales_target,
            sales_daily_out_annual_settings_sales_code:
              decypted.sales_daily_out_annual_settings_sales_code,
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

export const ViewSalesQuota = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await GetSpecificDefaultServices(
      "api/salesdailyout/settings_annual_quota/",
      id
    );
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
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};

export const postUpdateQuotaPerMonth = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/salesdailyout/settings_annual_quota/update_quota",
      formValues
    );
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        editModal: false,
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
