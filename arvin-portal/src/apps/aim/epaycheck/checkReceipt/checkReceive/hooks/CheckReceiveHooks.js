import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import React,{ useState, useEffect } from "react"; 
import { useDebounce } from "utils/HelperUtils";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form";
import { Constants } from "reducer/Contants";
import { decryptaes } from "utils/LightSecurity";
import { cancelRequest } from "api/api";
import{
  getCheckDetails,
  postCheckDetailsReceive,
} from "../../checkMonitoring/actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "CheckCollection"
const CheckReceiveHooks = (props) => {  
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const [searchParams, setSearchParams]   
                           = useSearchParams();
    const account_details  = useSelector((state) => state.AuthenticationReducer.account_details);
    const search           = searchParams.get("q")  != null ? String(searchParams.get("q")) : "";
    const page             = searchParams.get("p")  != null ? searchParams.get("p") : 1;
    const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
    const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
    const filterStatus     = searchParams.get("s")  != null ? String(searchParams.get("s")) : "TRANSMITTED";
    const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
    const debounceSearch   = useDebounce(searchParams, 100);
    const access           = useSelector((state) => state.AuthenticationReducer.access); 
    const selectedItem     = useSelector((state) => state.EpayCheckReducer.selectedItem); 
    const dataList         = useSelector((state) => state.EpayCheckReducer.dataList);
    const dataListCount    = useSelector((state) => state.EpayCheckReducer.dataListCount);
    const viewModal        = useSelector((state) => state.EpayCheckReducer.viewModal);  
    const editModal        = useSelector((state) => state.EpayCheckReducer.editModal); 
    const bank_accounts    = useSelector((state) => state.ReferenceReducer.bank_accounts); 
    const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
    const selectedDataList = useSelector((state) => state.EpayCheckReducer.selectedDataList); 
    const [state, setState]= React.useState({
        debounceTimer: null,
        debounceDelay: 1000,
        selectedCheck:[]
    }); 
    const columns = [
        { id:"card_name", label:"Customer", align:"left"},
        { id:"check_number", label:"Check Number", align:"left"},
        { id:"check_date", label:"Check Date", align:"left"},
        { id:"check_amount_display", label:"Check Amount", align:"left"},
        { id:"bank_description", label:"Bank", align:"left"},
        { id:"bank_address", label:"Bank Address", align:"left"},
        { id:"bank_branch", label:"Bank Branch", align:"left"},
        { id:"crpr", label:"CR/PR", align:"left"},
        { id:"received_date", label:"Received Date", align:"left"},
    ];
  
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
        // alert('qwer')
        const data = getListParam();
         await debounce(() => { 
           dispatch(getCheckDetails(data));
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
    }, [refresh,search,filterStartQuery,filterEndQuery,filterStatus,selectedDataList]);
      
      const onChangeSearch = (event) => { 
        const search = event.target.value;
        setSearchParams({ 
          q  : search,
          p  : page,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : filterStatus,
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
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedDataList: [], 
          },
        })
      };

      const onClickOpenReceiveModal = async  ()=> { 
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            viewModal: true,
          },
        });
      };
      const onClickCloseReceiveModal = () => {
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            viewModal: false,
          },
        });
      };

      const updateReceived = async (values) => {
        if(selectedDataList.length === 0){
          await swal({
            title: 'Warning',
            text: `Please select at least one check`,
            icon: "warning", 
          });
          return;
        }
        const data = {
          code: selectedDataList,
          received_date: moment(new Date()).format("YYYY-MM-DD"),
          received_by: account_details.code,
          status: values.status

        };
        const res = await swal({
          title: `${values.status === 'YES' ? 'Receive' : 'Undo Receipt of'} Check`,
          text: `Are you sure you want to ${values.status === 'YES' ? 'receive' : 'undo receipt of'} these ${selectedDataList.length} checks?`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
        
        if (res) {
          try {
            const res = await dispatch(postCheckDetailsReceive(data));
            await swal(res.title, res.message, res.status);   
            window.location.reload()
            dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                selectedDataList: [], 
              },
            })
            getCheckDetails()
          } catch (error) {
            await console.error(error);
          }
        }
      }

      const onClickReceive = async () =>{
        updateReceived({status:'YES'})
      }

      
      const onClickUndoReceive = async () =>{
        updateReceived({status:'NO'})
      }
      
      const handleCheckboxChange = (row, checked) => {
        if (checked) {
          if (!selectedDataList.includes(row.code)) {
            selectedDataList.push(row.code);
          }
        } else {
          const index = selectedDataList.indexOf(row.code);
          if (index > -1) {
            selectedDataList.splice(index, 1);
          }
        }
      };  

     
   
    return {
        viewModal, 
        state,
        account_details,
        columns,
        viewModal,
        access,
        dataList,
        dataListCount,
        page, 
        refresh,
        search,   
        selectedItem,
        bank_accounts,
        filterStatus,
        selectedDataList,
        editModal,
        onChangeSearch,
        onChangeFilteSubsection,
        onClickOpenReceiveModal,
        onClickCloseReceiveModal,
        handleCheckboxChange,
        onClickReceive,
        onClickUndoReceive
    };
};

export default CheckReceiveHooks;
