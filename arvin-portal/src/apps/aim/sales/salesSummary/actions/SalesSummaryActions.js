import { Constants } from "../../../../../reducer/Contants";
import { GetSpecificDefaultServices } from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getSalesSummaryData = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/report/get_report_sales_summary/?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
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
