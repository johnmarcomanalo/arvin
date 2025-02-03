import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getWeeklyChecCounterkData, 
} from "../actions/WeeklyCheckCounterActions";
import { ViewAmountFormatingDecimals } from "../../../../../../utils/AccountingUtils";
const WeeklyCheckCounterHooks = (props) => {
  const [searchParams, setSearchParams]  = useSearchParams();
  const dispatch         = useDispatch();
  const account_details  = useSelector((state) => state.AuthenticationReducer.account_details);
  const search           = searchParams.get("q")  != null ? String(searchParams.get("q")) : "";
  const page             = searchParams.get("p")  != null ? searchParams.get("p") : 1;
  const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
  const filterStatus     = searchParams.get("s")  != null ? String(searchParams.get("s")) : "ALL";
  const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
  const debounceSearch   = useDebounce(searchParams, 500);
  const access           = useSelector((state) => state.AuthenticationReducer.access); 
  const dataList         = useSelector((state) => state.EpayCheckReducer.dataList);
  const dataListCount    = useSelector((state) => state.EpayCheckReducer.dataListCount);
  const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
  
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
         p  : page == null ? 1 : page,
         q  : search,
         df : filterStartQuery,
         dt : filterEndQuery,
         s  : filterStatus,
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
            dispatch(getWeeklyChecCounterkData(data));
         }, state.debounceDelay);
       } catch (error) {
         await console.error(error);
       }
     };
 
    React.useEffect(() => { 
      props.initialize({ 
        filter_date_start: filterStartQuery,
        filter_date_end: filterEndQuery,
        filterStatus: filterStatus,
      });
      GetChequeList();
        return () => cancelRequest();
    }, [refresh, debounceSearch]);
    
  const onChangeFilterStart = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({
      q  : search, 
      p  : page == null ? 1 : page,
      df : newdate,
      dt : filterEndQuery,
      s  : filterStatus, 
      sc : filterSubSection
    });
  };

  const onChangeFilterEnd = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({
      q  : search, 
      p  : page == null ? 1 : page,
      df : filterStartQuery,
      dt : newdate,
      s  : filterStatus, 
      sc : filterSubSection
    });
  };

  const onChangeFilterStatus = (status) => {
    setSearchParams({
      q  : search, 
      p  : page == null ? 1 : page,
      df : filterStartQuery,
      dt : filterEndQuery,
      s  : status, 
      sc : filterSubSection
    });
  };

  const onChangeFilteSubsection = (subsection) => {
    setSearchParams({
      q  : search, 
      p  : page == null ? 1 : page,
      df : filterStartQuery,
      dt : filterEndQuery,
      s  : filterStatus, 
      sc : subsection
    });
  };
   
  return {
    access,
    status,
    onChangeFilterStart,
    onChangeFilterEnd,
    onChangeFilterStatus,
    onChangeFilteSubsection,
  };
};

export default WeeklyCheckCounterHooks;
