import { useDispatch, useSelector } from "react-redux";
import { getRefSalesRanking } from "../actions/ReferenceActions";
import { React, useEffect } from "react";
import { cancelRequest } from "../../../../api/api";
const RefSalesRankingPlacementsHooks = () => {
  const dispatch = useDispatch();
  const sales_ranking = useSelector(
    (state) => state.ReferenceReducer.sales_ranking
  );
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const GetRefSalesRankingList = () => {
    try {
      dispatch(getRefSalesRanking());
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetRefSalesRankingList();
    return () => cancelRequest();
  }, [refresh]);
  return {
    sales_ranking,
    GetRefSalesRankingList,
  };
};

export default RefSalesRankingPlacementsHooks;
