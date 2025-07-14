import React from "react";
import { useSelector } from "react-redux";
import { cancelRequest } from "../../../../../api/api";
import { change } from "redux-form";
const UpdateAnnualSalesQoutaClientGroupsHooks = (props) => {
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList[0]
  );

  const months_sales_target = [
    "january_sales_target",
    "february_sales_target",
    "march_sales_target",
    "april_sales_target",
    "may_sales_target",
    "june_sales_target",
    "july_sales_target",
    "august_sales_target",
    "september_sales_target",
    "october_sales_target",
    "november_sales_target",
    "december_sales_target",
  ];

  const onChangeMonthQuota = (e, fieldName) => {
    const newValue = parseFloat(e.target.value);

    let total = 0;
    for (let field of months_sales_target) {
      const value = field === fieldName ? newValue : parseFloat(props[field]); // get the current value from props

      total += isNaN(value) ? 0 : value;
    }

    props.dispatch(
      change("UpdateAnnualSalesQoutaClientGroups", "annual_sales_target", total)
    );
  };

  const onChangeYearQuota = (e) => {
    let value = e.target.value;
    let monthly = 0;

    if (value) {
      monthly = value / 12;
      months_sales_target.forEach((month) => {
        props.dispatch(
          change("UpdateAnnualSalesQoutaClientGroups", month, monthly)
        );
      });
    }
  };
  React.useEffect(() => {
    props.initialize({
      code: selectedDataList.code,
      description: selectedDataList.description,
      sales_daily_out_settings_client_group_code:
        selectedDataList.sales_daily_out_settings_client_group_code,
      year_sales_target: selectedDataList.year_sales_target,
      ref_product_groups_code: selectedDataList.ref_product_groups_code,
      bdo: selectedDataList.bdo,
      type: selectedDataList.type,
      subsection: selectedDataList.subsection,
      annual_sales_target: selectedDataList.annual_sales_target,
      january_sales_target: parseFloat(selectedDataList.january_sales_target),
      february_sales_target: parseFloat(selectedDataList.february_sales_target),
      march_sales_target: parseFloat(selectedDataList.march_sales_target),
      april_sales_target: parseFloat(selectedDataList.april_sales_target),
      may_sales_target: parseFloat(selectedDataList.may_sales_target),
      june_sales_target: parseFloat(selectedDataList.june_sales_target),
      july_sales_target: parseFloat(selectedDataList.july_sales_target),
      august_sales_target: parseFloat(selectedDataList.august_sales_target),
      september_sales_target: parseFloat(
        selectedDataList.september_sales_target
      ),
      october_sales_target: parseFloat(selectedDataList.october_sales_target),
      november_sales_target: parseFloat(selectedDataList.november_sales_target),
      december_sales_target: parseFloat(selectedDataList.december_sales_target),
      subgroup: selectedDataList.subgroup,
      product_group: selectedDataList.product_group,
    });
    return () => cancelRequest();
  }, []);

  return {
    onChangeMonthQuota,
    onChangeYearQuota,
  };
};

export default UpdateAnnualSalesQoutaClientGroupsHooks;
