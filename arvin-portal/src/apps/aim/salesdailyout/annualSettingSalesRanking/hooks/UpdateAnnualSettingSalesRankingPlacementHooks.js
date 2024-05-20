import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import {
  getAnnualSettingSaleRanking,
  getReferenceSalesRankingPlacements,
} from "../actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
const UpdateAnnualSettingSalesRankingPlacementHooks = (props) => {
  const dispatch = useDispatch();
  const refresh2 = useSelector((state) => state.SalesDailyOutReducer.refresh2);
  const selectedDataList = useSelector(
    (state) => state.SalesDailyOutReducer.selectedDataList
  );

  const sales_ranking_placements = useSelector(
    (state) => state.ReferenceReducer.sales_ranking_placements
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const dataSubList = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubList
  );
  React.useEffect(() => {
    props.initialize({
      code: selectedDataList?.code,
      description: selectedDataList?.description,
      ranking_placement: dataSubList,
      type: selectedDataList?.type,
      added_by: selectedDataList?.code,
      modified_by: selectedDataList?.code,
      value: selectedDataList?.value,
    });
    return () => cancelRequest();
  }, [refresh2, dataSubList]);
  const onClickAddRankingPlacement = () => {
    let placement = {
      index: sales_ranking_placements.length + 1,
      ref_sales_rankings_code: selectedDataList?.code,
      added_by: account_details?.code,
      modified_by: account_details?.code,
    };
    sales_ranking_placements.push(placement);
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh2: !refresh2,
      },
    });
  };
  const onClickRemoveRankingPlacement = () => {
    sales_ranking_placements.splice(sales_ranking_placements.length - 1, 1);
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh2: !refresh2,
      },
    });
  };
  return {
    account_details,
    onClickAddRankingPlacement,
    onClickRemoveRankingPlacement,
  };
};

export default UpdateAnnualSettingSalesRankingPlacementHooks;
