import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import { cancelRequest } from "../../../../../api/api";
const EditMonthlySalesQoutaHooks = (props) => {
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const months_to_change = [
    { code: "1", description: "January", value: "january_sales_target" },
    { code: "2", description: "February", value: "february_sales_target" },
    { code: "3", description: "March", value: "march_sales_target" },
    { code: "4", description: "April", value: "april_sales_target" },
    { code: "5", description: "May", value: "may_sales_target" },
    { code: "6", description: "June", value: "june_sales_target" },
    { code: "7", description: "July", value: "july_sales_target" },
    { code: "8", description: "August", value: "august_sales_target" },
    { code: "9", description: "September", value: "september_sales_target" },
    { code: "10", description: "October", value: "october_sales_target" },
    { code: "11", description: "November", value: "november_sales_target" },
    { code: "12", description: "December", value: "december_sales_target" },
  ];

  React.useEffect(() => {
    props.initialize({
      code: selectedDataList.code,
      sub_section: selectedDataList.sub_section,
      year_sales_target: selectedDataList.year_sales_target,
      ref_product_groups_description:
        selectedDataList.ref_product_groups_description,
      annual_sales_target: selectedDataList.annual_sales_target,
      added_by: account_details.code,
      modified_by: account_details.code,
    });
    return () => cancelRequest();
  }, []);

  return {
    months_to_change,
    selectedDataList,
  };
};

export default EditMonthlySalesQoutaHooks;
