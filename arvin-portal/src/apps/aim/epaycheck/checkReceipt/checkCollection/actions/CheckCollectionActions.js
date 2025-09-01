import { Constants } from "reducer/Contants.js";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
  GetDefaultServices,
} from "services/apiService";

import { decryptaes } from "utils/LightSecurity";
import swal from "sweetalert";
import configure from "apps/configure/configure.json";
export const getSalesInvoiceDetails = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const results = GetSpecificDefaultServices(
      "api/epaycheck/get_sales_invoice_list?c=" +
        formValues.c +
        "&d=" +
        formValues.d +
        "&s=" +
        formValues.s +
        "&q=" +
        formValues.q +
        "&p=" +
        formValues.p +
        "&sort_by=" +
        formValues.sort_by +
        "&order=" +
        formValues.order
    );

    results.then((res) => {
      let decrypted = decryptaes(res?.data);
      let data = decrypted?.dataList;
      dispatch({
        type: Constants.ACTION_EPAY_CHECK,
        payload: {
          dataList: data,
          dataListCount: decrypted.total,
        },
      });
    });
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status = "warning";
    if (typeof error.response.data.message !== "undefined")
      title = error.response.data.message;
      status = error.response.data.status;
    if (typeof error.response.data.errors !== "undefined") {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${value.join(", ")}`)
        .join("\n");
      message = formattedErrors;
    }
    await swal(title, message, status);
  } finally {
    setTimeout(() => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    }, 1000);
  }
};

export const postCheckCollection = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/epaycheck/check_details",
      formValues
    );

    return res;
  } catch (error) {
    
    var title = configure.error_message.default;
    var message = "";
    var status = "warning";
    if (typeof error.response.data.message !== "undefined")
      message = error.response.data.message;
      status = error.response.data.status;
    if (typeof error.response.data.errors !== "undefined") {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${value.join(", ")}`)
        .join("\n");
      message = formattedErrors;
    }
    swal({
      title: title, // Main alert title
      text: message, // Subtitle with more details
      icon: status, // Alert type (e.g., warning, error, success)
    });
  }finally{
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};

export const getReceiptDetails = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const results = await GetSpecificDefaultServices(
      "api/epaycheck/get_receipt_details?receipt_code=" +
        formValues.receipt_code +
        "&receipt_number=" +
        formValues.receipt_number +
        "&subsection_code=" +
        formValues.subsection_code
    );

    let decrypted = decryptaes(results?.data) 
    let data = decrypted?.data; 
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        printData: data,
      },
    }); 
    
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }
    
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
    
    await swal(title, message, status);
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } 
};


export const getCheckCustomer = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    let encodedQuery = encodeURIComponent(formValues.query);

    const results = GetSpecificDefaultServices(
      "api/epaycheck/get_check_customer?uc=" +
        formValues.uc +
        "&query=" +
        encodedQuery +
        "&page=" +
        formValues.page
    );

    results.then((res) => {
      let decrypted = decryptaes(res?.data);
      let data = decrypted?.dataList;
      dispatch({
        type: Constants.ACTION_EPAY_CHECK,
        payload: {
          dataList2: data,
          dataListCount2: decrypted.total,
        },
      });
    });
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
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
   setTimeout(() => {
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
   }, 1000);
  }
};
 

export const getReceiptFormatList = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const results = GetDefaultServices("api/epaycheck/get_receipt_format");
    results.then((res) => {
      let decrypted = decryptaes(res?.data);
      let data = decrypted?.dataList;
      dispatch({
        type: Constants.ACTION_EPAY_CHECK,
        payload: {
          dataListFormat: data,
        },
      });
    });
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
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
