import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getCollectorReportData, 
} from "../actions/CollectorReportActions";
import { ViewAmountFormatingDecimals } from "../../../../../../utils/AccountingUtils";
const CollectorReportHooks = (props) => {
  const [searchParams, setSearchParams]  = useSearchParams();
  const dispatch         = useDispatch();
  const account_details  = useSelector((state) => state.AuthenticationReducer.account_details); 
  const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
  const filterSap        = searchParams.get("sap") != null ? String(searchParams.get("sap")) : "MANILA";
  const debounceSearch   = useDebounce(searchParams, 500);
  const access           = useSelector((state) => state.AuthenticationReducer.access);
  const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
  const reportData       = useSelector((state) => state.EpayCheckReducer.reportData);
  
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000, 
  });  

    const sapList = [
         { description: 'MANILA'},
         { description: 'PROVINCE'},
         { description: 'PEANUT'},
     ]
 
     const getListParam = () => {
       const data = {
         df : filterStartQuery,
         dt : filterEndQuery, 
         sap : filterSap
       };
       return data;
     };
 
     const debounce = (func, delay) => {
       clearTimeout(state.debounceTimer);
       state.debounceTimer = setTimeout(func, delay);
     };
 
     const GetChequeList = async () => {
       try {
         const data = getListParam();
          await debounce(() => { 
            dispatch(getCollectorReportData(data));
         }, state.debounceDelay);
       } catch (error) {
         await console.error(error);
       }
     };
 
    React.useEffect(() => { 
      props.initialize({  
        filter_date_start: filterStartQuery,
        filter_date_end: filterEndQuery,
        filterSap: filterSap,
      });
      GetChequeList();
        return () => cancelRequest();
    }, [refresh, debounceSearch]);
    
  const onChangeFilterStart = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({ 
      df : newdate,
      dt : filterEndQuery, 
      sap : filterSap
    });
  };

  const onChangeFilterEnd = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({ 
      df : filterStartQuery,
      dt : newdate, 
      sap : filterSap
    });
  };
 
  const onChangeFilterSap = (sap) => {
    setSearchParams({ 
      df : filterStartQuery,
      dt : filterEndQuery, 
      sap : sap
    });
  };
   
  return {
    access,
    sapList,
    reportData,
    onChangeFilterStart,
    onChangeFilterEnd, 
    onChangeFilterSap,
  };
};

export default CollectorReportHooks;
