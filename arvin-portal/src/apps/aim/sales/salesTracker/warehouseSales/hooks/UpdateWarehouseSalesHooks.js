import { cancelRequest } from "api/api";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import { toNumber } from "utils/AccountingUtils";
const UpdateWarehouseSalesHooks = (props) => {
  const dispatch = useDispatch();
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
  });
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const transferType = [
    { description: "ADDITIONAL/SUBTRACT" },
    { description: "CHANGE" },
    { description: "HOLIDAY" },
    { description: "TRANSFER" },
  ];
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const user_access_organization_rights =
    access?.user_access_organization_rights;
  React.useEffect(() => {
    props.initialize({
      code: selectedDataList.code,
      daily_sales_target_percentage:
        selectedDataList.daily_sales_target_percentage,
      ref_product_groups_description:
        selectedDataList.ref_product_groups_description,
      sales_daily_out: selectedDataList.sales_daily_out,
      sales_daily_out_annual_settings_sales_code:
        selectedDataList.sales_daily_out_annual_settings_sales_code,
      sales_daily_qouta: selectedDataList.sales_daily_qouta,
      sales_daily_target: selectedDataList.sales_daily_target,
      sales_date: selectedDataList.sales_date,
      subsection_code: selectedDataList.subsection_code,
      year_sales_target: selectedDataList.year_sales_target,
      transfer_type: "",
      monthly_sales_target: toNumber(monthly_sales_target),
      account_code: account_details.code,
    });
    return () => cancelRequest();
  }, [selectedDataList]);

  const onChangeTransfer = (value, daily_out) => {
    try {
      let sales_daily_out = toNumber(daily_out);
      let transfer = toNumber(value);
      let new_daily_out = 0;
      new_daily_out = parseFloat(sales_daily_out) + parseFloat(transfer);
      computeDailyTargetPercentage(
        new_daily_out,
        selectedDataList.sales_daily_qouta
      );
    } catch (error) {
      console.error(error);
    }
  };

  const computeDailyTargetPercentage = async (daily_out, daily_quota) => {
    try {
      let sales_daily_quota = toNumber(daily_quota);
      let percentage_daily_target = 100;
      let status_daily_target = 0;
      await debounce(() => {
        status_daily_target = daily_out - sales_daily_quota;
        percentage_daily_target =
          (status_daily_target / sales_daily_quota) * 100;
        props.dispatch(
          change(
            "UpdateSales",
            "new_sales_daily_target",
            parseFloat(status_daily_target).toFixed(2)
          )
        );
        props.dispatch(
          change(
            "UpdateSales",
            "new_daily_sales_target_percentage",
            parseFloat(percentage_daily_target).toFixed(2)
          )
        );
        props.dispatch(
          change(
            "UpdateSales",
            "new_sales_daily_out",
            parseFloat(daily_out).toFixed(2)
          )
        );
      }, state.debounceDelay);
    } catch (error) {
      console.error(error);
    }
  };
  const onChangeFilterTransferType = (type) => {
    try {
      props.dispatch(change("UpdateSales", "transfer__type", type));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    selectedDataList,
    transferType,
    user_access_organization_rights,
    computeDailyTargetPercentage,
    onChangeTransfer,
    onChangeFilterTransferType,
  };
};

export default UpdateWarehouseSalesHooks;
