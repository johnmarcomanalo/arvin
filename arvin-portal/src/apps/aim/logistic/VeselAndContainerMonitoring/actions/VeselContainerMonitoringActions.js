import swal from "sweetalert";
import { Constants } from "../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";
import configure from "apps/configure/configure.json";
import { Refresh } from "@mui/icons-material";

export const getPODetails = (values) => async (dispatch) => {
  try {
    // Start loading
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: true },
    });
  
    
    const url =
      "api/logistic/monitoring/get_po_details?p=" +
      values.p +
      "&q=" +
      values.q +
      // "&df=" +
      // values.df +
      // "&dt=" +
      // values.dt +
      "&sap=" +
      values.sap +
      "&m=" +
      values.m +
      "&sort_by=" +
      values.sort_by +
      "&order=" +
      values.order;

    const res = await GetSpecificDefaultServices(url);
 
    let decrypted = decryptaes(res?.data);
  
    dispatch({
      type: Constants.ACTION_LOGISTIC,
      payload: {
        dataList: decrypted.dataList,
        dataListCount: decrypted.total,
      },
    });
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status = "warning";

    if (error?.response?.data?.message) {
      title = error.response.data.message;
      status = error.response.data.status || "warning";
    }

    if (error?.response?.data?.errors) {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([_, value]) => value.join(", "))
        .join("\n");
      message = formattedErrors;
    }

    await swal(title, message, status);
  } finally {
    // Stop loading
    setTimeout(() => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: { loading: false },
      });
    }, 1000);
  }
};



export const getInvoiceDetails = (values) => async (dispatch) => {
  try {
    // Start loading
    dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: true },
    });
 
    const url =
      "api/logistic/monitoring/get_specific_invoice_details?invoice=" + values.invoice + 
      "&sap=" +  values.sap +
      "&monitoring=" +  values.monitoring;

    const res = await GetSpecificDefaultServices(url);
 
    let decrypted = decryptaes(res?.data); 

    if (decrypted.length!==0) {
      dispatch({
        type: Constants.ACTION_LOGISTIC,
        payload: {
          refresh:true,
          monitoringData: decrypted, 
        },
      });
    }else{
      dispatch({
        type: Constants.ACTION_LOGISTIC,
        payload: {
          refresh:false,
          monitoringData: decrypted, 
        },
      });
    }
    
   
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status = "warning";

    if (error?.response?.data?.message) {
      title = error.response.data.message;
      status = error.response.data.status || "warning";
    }

    if (error?.response?.data?.errors) {
      const formattedErrors = Object.entries(error.response.data.errors)
        .map(([_, value]) => value.join(", "))
        .join("\n");
      message = formattedErrors;
    }
    dispatch({
        type: Constants.ACTION_LOADING,
        payload: { loading: false },
      });

    await swal(title, message, status);
  } finally {
    // Stop loading
    setTimeout(() => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: { loading: false },
      });
    }, 1000);
  }
};
