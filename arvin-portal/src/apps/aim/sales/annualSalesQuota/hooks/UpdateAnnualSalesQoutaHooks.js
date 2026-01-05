import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import { cancelRequest } from "../../../../../api/api";
const UpdateAnnualSalesQoutaHooks = (props) => {
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const updateType = [
    { description: "QUOTA" },
    { description: "RESET MONTH WITHOUT TRANSFER" },
  ];

  const resetType = [
    { code: 13, description: "ALL" },
    { code: 1, description: "JANUARY" },
    { code: 2, description: "FEBRUARY" },
    { code: 3, description: "MARCH" },
    { code: 4, description: "APRIL" },
    { code: 5, description: "MAY" },
    { code: 6, description: "JUNE" },
    { code: 7, description: "JULY" },
    { code: 8, description: "AUGUST" },
    { code: 9, description: "SEPTEMBER" },
    { code: 10, description: "OCTOBER" },
    { code: 11, description: "NOVEMBER" },
    { code: 12, description: "DECEMBER" },
  ];

  React.useEffect(() => {
    props.initialize({
      code: selectedDataList.code,
      sub_section: selectedDataList.sub_section,
      subsection_code: selectedDataList.subsection_code,
      year_sales_target: selectedDataList.year_sales_target,
      ref_product_groups_description:
        selectedDataList.ref_product_groups_description,
      ref_product_groups_code: selectedDataList.ref_product_groups_code,
      annual_sales_target: selectedDataList.annual_sales_target,
      january_sales_target: selectedDataList.january_sales_target,
      february_sales_target: selectedDataList.february_sales_target,
      march_sales_target: selectedDataList.march_sales_target,
      april_sales_target: selectedDataList.april_sales_target,
      may_sales_target: selectedDataList.may_sales_target,
      june_sales_target: selectedDataList.june_sales_target,
      july_sales_target: selectedDataList.july_sales_target,
      august_sales_target: selectedDataList.august_sales_target,
      september_sales_target: selectedDataList.september_sales_target,
      october_sales_target: selectedDataList.october_sales_target,
      november_sales_target: selectedDataList.november_sales_target,
      december_sales_target: selectedDataList.december_sales_target,

      new_annual_sales_target: selectedDataList.annual_sales_target,
      new_january_sales_target: selectedDataList.january_sales_target,
      new_february_sales_target: selectedDataList.february_sales_target,
      new_march_sales_target: selectedDataList.march_sales_target,
      new_april_sales_target: selectedDataList.april_sales_target,
      new_may_sales_target: selectedDataList.may_sales_target,
      new_june_sales_target: selectedDataList.june_sales_target,
      new_july_sales_target: selectedDataList.july_sales_target,
      new_august_sales_target: selectedDataList.august_sales_target,
      new_september_sales_target: selectedDataList.september_sales_target,
      new_october_sales_target: selectedDataList.october_sales_target,
      new_november_sales_target: selectedDataList.november_sales_target,
      new_december_sales_target: selectedDataList.december_sales_target,
      account_code: account_details.code,
      update_type: "",
    });
    return () => cancelRequest();
  }, [selectedDataList]);

  return {
    selectedDataList,
    updateType,
    resetType,
  };
};

export default UpdateAnnualSalesQoutaHooks;
