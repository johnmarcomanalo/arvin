import swal from "sweetalert";
import { Constants } from "../../../../../reducer/Contants";
import {
  GetDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";
import configure from "apps/configure/configure.json";

export const postClientGroup = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/salesdailyout/client_groups",
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
    var status = "error";
    var message = "";
    if (error.response && error.response.data) {
      if (error.response.data.message) title = error.response.data.message;
      if (error.response.data.message) status = error.response.data.status;
      if (error.response.data.errors) {
        const formattedErrors = Object.entries(error.response.data.errors)
          .map(([key, value]) => `${value.join(", ")}`)
          .join("\n");
        message = formattedErrors;
      }
    }
    await swal(title, message, status);
  } finally {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};

export const fetchGetClientGroups = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = await GetDefaultServices(
      "api/salesdailyout/client_groups"
    );
    let decypted = decryptaes(response.data);
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        client_groups: decypted,
      },
    });
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

export const getClientGroups = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/client_groups/get_group_clients?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&ref=" +
        values.ref
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

export const getRefClientGroups = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/client_groups/get_group_clients?ref_client_groups_page=" +
        values.ref_client_groups_page +
        "&ref_client_groups_limit=" +
        values.ref_client_groups_limit +
        "&ref_client_groups_search=" +
        values.ref_client_groups_search +
        "&ref_client_groups_filter=" +
        values.ref_client_groups_filter +
        "&ref=" +
        true
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
        type: Constants.ACTION_REFERENCE,
        payload: {
          client_groups: decrypted.dataList.data,
          client_groups_count: decrypted.dataList.total,
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
