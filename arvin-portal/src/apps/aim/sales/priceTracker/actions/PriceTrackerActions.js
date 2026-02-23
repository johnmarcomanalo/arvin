import configure from "apps/configure/configure.json";
import swal from "sweetalert";
import { Constants } from "../../../../../reducer/Contants";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getPrice = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/pricetracker/display_prices?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&w=" +
        values.w +
        "&d=" +
        values.d,
    );
    response.then((res) => {
      let decrypted = decryptaes(res.data);
      // dispatch({
      //   type: Constants.ACTION_SALES_DAILY_OUT,
      //   payload: {
      //     dataList: decrypted.dataList.data,
      //     dataListCount: decrypted.dataList.total,
      //     last_page: decrypted.dataList.last_page,
      //   },
      // });

      dispatch({
        type: "get_prices",
        data: decrypted.dataList,
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

export const getPriceHistory = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/pricetracker/price_history?ItemCode=" +
        values.ItemCode +
        "&ItemName=" +
        values.ItemName +
        "&SourceType=" +
        values.SourceType +
        "&Warehouse=" +
        values.Warehouse +
        "&Brand=" +
        values.Brand +
        "&TaxCode=" +
        values.TaxCode,
    );
    response.then((res) => {
      let decrypted = decryptaes(res.data);
      console.log(decrypted);
      dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          dataSubList: decrypted.dataList,
          dataSubListCount: decrypted.dataListCount,
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
