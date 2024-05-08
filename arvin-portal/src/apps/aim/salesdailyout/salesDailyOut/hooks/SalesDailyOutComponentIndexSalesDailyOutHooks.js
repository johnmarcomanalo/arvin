import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificRefSubSection } from "../../../reference/actions/ReferenceActions";
const SalesDailyOutComponentIndexSalesDailyOutHooks = (props) => {
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const selected_subsection = useSelector(
    (state) => state.ReferenceReducer.selected_subsection
  );
  const GetSpecificRefSubSection = () => {
    try {
      dispatch(getSpecificRefSubSection(account_details.subsection_code));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetSpecificRefSubSection();
  }, []);
  return {
    account_details,
    selected_subsection,
  };
};

export default SalesDailyOutComponentIndexSalesDailyOutHooks;
