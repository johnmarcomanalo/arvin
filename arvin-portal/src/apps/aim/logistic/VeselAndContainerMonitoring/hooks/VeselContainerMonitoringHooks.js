 import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import React,{ useState, useEffect } from "react"; 
import { useDebounce } from "utils/HelperUtils";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form";
import { Constants } from "reducer/Contants";
import { decryptaes } from "utils/LightSecurity";
import { cancelRequest } from "api/api";

import {
   getPODetails
} from '../actions/VeselContainerMonitoringActions'

const VeselContainerMonitoringHooks = (props) => { 
   const [searchParams, setSearchParams]  = useSearchParams();
   const dispatch         = useDispatch();
   const refresh          = useSelector((state) => state.LogisticReducer.refresh);
   const Loadingrefresh   = useSelector((state) => state.LoadingReducer.refresh);
   const dataList         = useSelector((state) => state.LogisticReducer.dataList);
   const dataListCount    = useSelector((state) => state.LogisticReducer.dataListCount);
   const monitoringData    = useSelector((state) => state.LogisticReducer.monitoringData);
   const viewModal    = useSelector((state) => state.LogisticReducer.viewModal);
   const page             = searchParams.get("p")       != null ? parseInt(searchParams.get("p")) : 1;
   const filterStartQuery = searchParams.get("df")      != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
   const filterEndQuery   = searchParams.get("dt")      != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
   const sap              = searchParams.get("sap")     != null ? String(searchParams.get("sap")) : props.sap ? props.sap : "MANILA";
   const monitoring       = searchParams.get("m")       != null ? String(searchParams.get("m")) : props.monitoring ? props.monitoring : "";
   const search           = searchParams.get("q")       != null ? String(searchParams.get("q")) : "";
   const filter_order     = searchParams.get("order")   != null ? String(searchParams.get("order")) : "asc";
   const filter_sort_by   = searchParams.get("sort_by") != null ? String(searchParams.get("sort_by")) : "code";
   const [state, setState]= React.useState({
      debounceTimer: null,
      debounceDelay: 1000,
      selectedCheck:[],
      sort_by: "cardCode", // Default sorting order
      order: "asc", // Default sorting field
  });
  

   const sapList = [
      {description:'MANILA'},
      {description:'PROVINCE'},
      {description:'PEANUT'},
   ]

   const vesselAndContainer = [
      { description:'VESSEL'},
      { description:'CONTAINER'},
   ]

   const columns = [
      { id:"PODate", label:"PO Date", align:"left", sortable: false},
      { id:"PONumber", label:"PO Number", align:"left", sortable: false},
      { id:"FCL", label:"FCL", align:"left", sortable: false},
      { id:"InvoiceNo", label:"Invoice No.", align:"left", sortable: false}, 
      { id:"BLNo", label:"BL No.", align:"left", sortable: true},
      { id:"Broker", label:"Broker", align:"left", sortable: true},
      { id:"Vessel", label:"Vessel", align:"left", sortable: true},
      { id:"Quantity", label:"Quantity", align:"left", sortable: true}, 
  ];
   

   const getListParam = () => {
      const data = {
        df  :  filterStartQuery,
        dt  :  filterEndQuery,
        sap :  sap,
        m   :  monitoring,
        q   :  search,
        p   :  page,
        sort_by: filter_sort_by,
        order: filter_order,
      };
      return data;
    };

    const getPOListDetails = async () => {
      try {
        const data = await getListParam();
        await dispatch(getPODetails(data));
      } catch (error) {
        console.error(error);
      }
    };


    React.useEffect(() => {
        getPOListDetails()
    }, [
      refresh,
      sap,
      monitoring,
      search,
      filterEndQuery,
      filterStartQuery,
      page
   ]);

   React.useEffect(() => { 
      props.initialize({ 
         sap: "MANILA", 
         monitoring: "VESSEL",
        filter_date_start: filterStartQuery,
        filter_date_end: filterEndQuery
      });
    }, []);

   const onChangeSAP = (sap) =>{
      setSearchParams({
         df  :  filterStartQuery,
         dt  :  filterEndQuery,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: filter_sort_by,
         order: filter_order,
       });
   }

   const onChangePage = (event, newPage) => {
      setSearchParams({
         df  : filterStartQuery,
         dt  : filterEndQuery,
         sap : sap,
         m   : monitoring,
         q   : search,
         p   : newPage,   // ✅ always use the newPage value
         sort_by: filter_sort_by,
         order: filter_order,
      });
   };

   const onChangeMonitoring = (monitoring) =>{
      setSearchParams({
         df  :  filterStartQuery,
         dt  :  filterEndQuery,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: filter_sort_by,
         order: filter_order,
       });
   }

   const onChangeFilterStart = (date)=>{
      const newdate = moment(date).format("YYYY-MM-DD");
      setSearchParams({
         df  :  newdate,
         dt  :  filterEndQuery,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: filter_sort_by,
         order: filter_order,
       });
   }

   const onChangeFilterEnd = (date)=>{
      const newdate = moment(date).format("YYYY-MM-DD");
      setSearchParams({
         df  :  filterStartQuery,
         dt  :  newdate,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: filter_sort_by,
         order: filter_order,
       });
   }

   
   const onChangeSearch = (event) =>{
      const search = event.target.value;
      setSearchParams({
         df  :  filterStartQuery,
         dt  :  filterEndQuery,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: filter_sort_by,
         order: filter_order,
       });
   }

   const onChangeSorting = (field, direction) => { 
      setState((prevState) => ({
        ...prevState,
        sort_by: field,
        order: direction,
      }));
    
      setSearchParams({
         df  :  filterStartQuery,
         dt  :  filterEndQuery,
         sap :  sap,
         m   :  monitoring,
         q   :  search,
         p   :  1,
         sort_by: field,
         order: direction,
      });
     
    };
 
    const onClickOpenModal = (row) => {
      dispatch({
        type: Constants.ACTION_LOGISTIC,
        payload: {
          viewModal: true,
          selectedDataRow: row,
          monitoring: monitoring
        },
      });
    };
    const onClickCloseModal = () => {
      dispatch({
        type: Constants.ACTION_LOGISTIC,
        payload: {
          viewModal: false,
        },
      });
    };
  

   return {
      page,
      search,
      sapList,
      vesselAndContainer,
      columns,
      dataList,
      dataListCount,
      viewModal,
      onChangeSAP,
      onChangeSearch,
      onChangeFilterStart,
      onChangeFilterEnd,
      onChangeMonitoring,
      onChangePage,
      onChangeSorting, 
      onClickOpenModal,
      onClickCloseModal
   }

};

export default VeselContainerMonitoringHooks;
