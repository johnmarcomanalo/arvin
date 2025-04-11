import { Constants } from "../../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../../services/apiService";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import configure from "apps/configure/configure.json";

export const getSalesSummaryData = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/sales_tracker/report/get_report_sales_summary/?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&pg=" +
        values.pg +
        "&id=" +
        values.id +
        "&user_code=" +
        values.user_code
    );
    response.then((res) => {
      try {
        let decrypted = decryptaes(res.data);
        dispatch({
          type: Constants.ACTION_SALES_DAILY_OUT,
          payload: {
            annual_sales_mtd_ytd_subsections:
              decrypted?.annual_sales_mtd_ytd_subsections,
            annual_sales_out_summary: decrypted?.annual_sales_out_summary,
            current_sales_mtd_ytd_subsections:
              decrypted?.current_sales_mtd_ytd_subsections,
            yearly_sales_line_chart_summary:
              decrypted?.yearly_sales_line_chart_summary,
            total_daily_out_amount: decrypted?.total_daily_out_amount,
            annual_set_total_count_subsections:
              decrypted.annual_set_total_count_subsections,
            annual_set_subsections: decrypted.annual_set_subsections,
            get_today_sales: decrypted.get_today_sales,
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
