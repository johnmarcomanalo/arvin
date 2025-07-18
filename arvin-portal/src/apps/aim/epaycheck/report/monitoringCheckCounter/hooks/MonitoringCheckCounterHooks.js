import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";
import {
  getMonitoringCheckCounterData, 
} from "../actions/MonitoringCheckCounterActions";
import { ViewAmountFormatingDecimals } from "../../../../../../utils/AccountingUtils";
const MonitoringCheckCounterHooks = (props) => {
  const [searchParams, setSearchParams]  = useSearchParams();
  const dispatch         = useDispatch();
  const account_details  = useSelector((state) => state.AuthenticationReducer.account_details); 
  const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
  const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD"); 
  const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
  const filterStatus     = searchParams.get("st") != null ? String(searchParams.get("st")) : "ON-HAND";
  const debounceSearch   = useDebounce(searchParams, 500);
  const access           = useSelector((state) => state.AuthenticationReducer.access);
  const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
  const reportData       = useSelector((state) => state.EpayCheckReducer.reportData);
  
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000, 
  });  

    const status = [
         { status:false , description: 'ON-HAND'},
         { status:true  , description: 'DEPOSITED'},
         { status:true  , description: 'TRANSMITTED'},
     ]
 
     const getListParam = () => {
       const data = {
         df : filterStartQuery,
         dt : filterEndQuery, 
         sc : filterSubSection,
         st : filterStatus
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
            dispatch(getMonitoringCheckCounterData(data));
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
      sc : filterSubSection,
      st : filterStatus
    });
  };

  const onChangeFilterEnd = (date) => {
    const newdate = moment(date).format("YYYY-MM-DD");
    setSearchParams({ 
      df : filterStartQuery,
      dt : newdate, 
      sc : filterSubSection,
      st : filterStatus
    });
  };
 
  const onChangeFilteSubsection = (subsection) => {
    setSearchParams({ 
      df : filterStartQuery,
      dt : filterEndQuery, 
      sc : subsection,
      st : filterStatus
    });
  };
  const onChangeFilterStatus = (status) => {
    setSearchParams({ 
      df : filterStartQuery,
      dt : filterEndQuery, 
      sc : filterSubSection,
      st : status
    });
  };
   
  const groupedSorted = (data) => {
    if (data.length === 0) return [];
  
    const sortByDescription = (arr) =>
      arr.sort((a, b) => a.description.localeCompare(b.description));
  
    const manila = sortByDescription(
      data.filter((item) => item.department_description === "Manila Branch")
    );
  
    const provincial = sortByDescription(
      data.filter((item) => item.department_description === "Provincial")
    );
  
    if (manila.length === 0 && provincial.length === 0) return []; 
    if (manila.length === 0) return [...provincial];
    if (provincial.length === 0) return [...manila];
  
    return [
      { code: "Provincial", description: "ALL PROVINCE" },
      ...provincial,
      { code: "Manila Branch", description: "ALL MANILA" },
      ...manila,
    ];
  };    
  
  const warehouseList = groupedSorted(access.user_access_organization_rights); 

  return {
    status,
    reportData,
    filterStatus,
    warehouseList,
    onChangeFilterStart,
    onChangeFilterEnd, 
    onChangeFilteSubsection,
    onChangeFilterStatus
  };
};

export default MonitoringCheckCounterHooks;
