import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getWeeklyChecCounterData, 
} from "../actions/WeeklyCheckCounterActions";
import { ViewAmountFormatingDecimals } from "../../../../../../utils/AccountingUtils";
const WeeklyCheckCounterHooks = (props) => {
  const [searchParams, setSearchParams]  = useSearchParams();
  const dispatch         = useDispatch();
  const account_details  = useSelector((state) => state.AuthenticationReducer.account_details); 
  const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD"); 
  const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
  const debounceSearch   = useDebounce(searchParams, 500);
  const access           = useSelector((state) => state.AuthenticationReducer.access);
  const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
  const reportData       = useSelector((state) => state.EpayCheckReducer.reportData);
  
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000, 
  });  

    const status = [
         { status:false , description: 'ALL'},
         { status:false , description: 'ON-HAND'},
         { status:true  , description: 'DEPOSITED'},
         { status:true  , description: 'TRANSMITTED'},
     ]
 
     const getListParam = () => {
       const data = {
         df : filterStartQuery,
         dt : filterEndQuery, 
         sc : filterSubSection
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
            dispatch(getWeeklyChecCounterData(data));
         }, state.debounceDelay);
       } catch (error) {
         await console.error(error);
       }
     };
 
    React.useEffect(() => { 
      props.initialize({ 
        filter_date_start: filterStartQuery,
        filter_date_end: filterEndQuery,
      });
      GetChequeList();
        return () => cancelRequest();
    }, [refresh, debounceSearch]);
    
  const onChangeFilterStart = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({ 
      df : newdate,
      dt : filterEndQuery, 
      sc : filterSubSection
    });
  };

  const onChangeFilterEnd = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({ 
      df : filterStartQuery,
      dt : newdate, 
      sc : filterSubSection
    });
  };
 
  const onChangeFilteSubsection = (subsection) => {
    setSearchParams({ 
      df : filterStartQuery,
      dt : filterEndQuery, 
      sc : subsection
    });
  };
   
  return {
    access,
    status,
    reportData,
    onChangeFilterStart,
    onChangeFilterEnd, 
    onChangeFilteSubsection,
  };
};

export default WeeklyCheckCounterHooks;
