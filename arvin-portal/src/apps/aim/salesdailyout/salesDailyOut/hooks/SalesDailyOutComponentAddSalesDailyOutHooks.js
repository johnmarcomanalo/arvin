import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../../reducer/Contants";
import { getAnnualMonthlyDailyTargetSalesBySectionSubsection } from "../../annualSettingSale/actions/SalesDailyOutComponentAnnualSettingSaleActions";
import { getStatusDailyTargetAndPercentageDailyTargetByDailyOut } from "../actions/SalesDailyOutComponentSalesDailyOutActions";
const SalesDailyOutComponentAddSalesDailyOutHooks = (props) => {
  const refresh = useSelector((state) => state.SalesDailyOutReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
    year: moment(new Date()).format("YYYY"),
  });

  const dispatch = useDispatch();
  const addModal = useSelector((state) => state.SalesDailyOutReducer.addModal);
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );

  const onClickOpenAddModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: true,
      },
    });
  };
  const onClickCloseAddModal = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal: false,
      },
    });
  };

  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };

  const GetStatusDailyTargetAndPercentageDailyTargetByDailyOut = async (
    daily_out,
    daily_quota
  ) => {
    try {
      await debounce(() => {
        dispatch(
          getStatusDailyTargetAndPercentageDailyTargetByDailyOut(
            daily_out,
            daily_quota
          )
        );
      }, state.debounceDelay);
    } catch (error) {
      console.error(error);
    }
  };
  const GetAnnualMonthlyDailyTargetSalesBySectionSubsection = () => {
    try {
      dispatch(
        getAnnualMonthlyDailyTargetSalesBySectionSubsection(
          account_details.subsection_code,
          state.year
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection();
  }, []);
  return {
    addModal,

    onClickOpenAddModal,
    onClickCloseAddModal,
    GetAnnualMonthlyDailyTargetSalesBySectionSubsection,
    GetStatusDailyTargetAndPercentageDailyTargetByDailyOut,
  };
};

export default SalesDailyOutComponentAddSalesDailyOutHooks;
