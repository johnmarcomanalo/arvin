import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import { cancelRequest } from "../../../../../api/api";
import { decryptaes } from "../../../../../utils/LightSecurity";
import {
  getSalesDailyOutbyID,
  getStatusDailyTargetAndPercentageDailyTargetByDailyOut,
} from "../../salesTracker/actions/SalesTrackerActions";
const MoveSaleQuotaHooks = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
  });
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  React.useEffect(() => {
    props.initialize({
      ref_sub_sections_description:
        selectedDataList.ref_sub_sections_description,
      sales_daily_out_annual_settings_sales_code:
        selectedDataList.sales_daily_out_annual_settings_sales_code,
      subsection_code: selectedDataList.subsection_code,
      ref_product_groups_description:
        selectedDataList.ref_product_groups_description,
      year_sales_target: selectedDataList.year_sales_target,
      move_from_sales_daily_qouta: selectedDataList.sales_daily_qouta,
      move_from_sales_date: selectedDataList.sales_date,
      move_from_sales_daily_out: selectedDataList.sales_daily_out,
      move_from_sales_daily_target: selectedDataList.sales_daily_target,
      move_from_daily_sales_target_percentage:
        selectedDataList.daily_sales_target_percentage,
      added_by: account_details.code,
      modified_by: account_details.code,
    });
    return () => cancelRequest();
  }, []);
  const onSelectDateToMove = (date) => {
    let data = {
      sales_date: moment(date).format("YYYY-MM-DD"),
      sales_daily_out_annual_settings_sales_code:
        selectedDataList.sales_daily_out_annual_settings_sales_code,
    };
    const response = dispatch(getSalesDailyOutbyID(data));
    response.then((res) => {
      let details = decryptaes(res.data);
      props.dispatch(
        change(
          "MoveSaleQuota",
          "move_to_sales_daily_out",
          details.sales_daily_out
        )
      );
      props.dispatch(
        change(
          "MoveSaleQuota",
          "move_to_sales_daily_target",
          details.sales_daily_target
        )
      );
      props.dispatch(
        change(
          "MoveSaleQuota",
          "move_to_daily_sales_target_percentage",
          details.daily_sales_target_percentage
        )
      );
      props.dispatch(
        change(
          "MoveSaleQuota",
          "move_to_sales_daily_qouta",
          details.sales_daily_qouta
        )
      );
    });
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const computeStatusPercentageDailyTarget = async (value, quota) => {
    try {
      if (value > 0) {
        await debounce(() => {
          const response = dispatch(
            getStatusDailyTargetAndPercentageDailyTargetByDailyOut(value, quota)
          );
          response.then((res) => {
            let data = res.data;
            props.dispatch(
              change(
                "MoveSaleQuota",
                "updated_sales_daily_target",
                data.status_daily_target
              )
            );
            props.dispatch(
              change(
                "MoveSaleQuota",
                "updated_daily_sales_target_percentage",
                data.percentage_daily_target
              )
            );
          });
        }, state.debounceDelay);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return {
    selectedDataList,
    onSelectDateToMove,
    computeStatusPercentageDailyTarget,
  };
};

export default MoveSaleQuotaHooks;
