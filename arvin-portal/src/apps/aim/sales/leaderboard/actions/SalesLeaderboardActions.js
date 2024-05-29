import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getAnnualSalesRanking = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/annual_sales_ranking/get_sales_ranking_by_id?page=" +
        formValues.p +
        "&limit=" +
        formValues.l +
        "&q=" +
        formValues.q +
        "&f=" +
        formValues.f +
        "&uid=" +
        formValues.u +
        "&rc=" +
        formValues.rc
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
          selected_code: decrypted.rank_code,
          target_point: decrypted?.target_point,
        },
      });
      // swal(decrypted.title, decrypted.message, decrypted.status);
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const postCreateRankerAnnualSalesRanking =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/salesdailyout/annual_sales_ranking",
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

export const getAnnualSettingSale = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/salesdailyout/annual_settings_sales/get_sales_annual_settings?page=" +
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
    console.log(error);
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
      console.log(error);
    }
  };

export const postPlacementAnnualSalesRanking =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/salesdailyout/annual_sales_ranking_details",
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
