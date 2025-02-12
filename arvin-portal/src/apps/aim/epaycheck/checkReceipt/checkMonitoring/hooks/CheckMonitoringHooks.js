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
  getAllRefBankAccounts,
} from "../../../../settings/reference/actions/ReferenceActions";
import {
    getCheckDetails,
    postCheckDetailsStatus,
    postCheckDetailsReceive
} from "../actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "CheckCollection"
const CheckMonitoringHooks = (props) => {  
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const [searchParams, setSearchParams]   
                           = useSearchParams();
    const account_details  = useSelector((state) => state.AuthenticationReducer.account_details);
    const search           = searchParams.get("q")  != null ? String(searchParams.get("q")) : "";
    const page             = searchParams.get("p")  != null ? searchParams.get("p") : 1;
    const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
    const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
    const filterStatus     = searchParams.get("s")  != null ? String(searchParams.get("s")) : "ON-HAND";
    const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
    const debounceSearch   = useDebounce(searchParams, 100);
    const access           = useSelector((state) => state.AuthenticationReducer.access); 
    const selectedItem     = useSelector((state) => state.EpayCheckReducer.selectedItem); 
    const dataList         = useSelector((state) => state.EpayCheckReducer.dataList);
    const dataListCount    = useSelector((state) => state.EpayCheckReducer.dataListCount);
    const viewModal        = useSelector((state) => state.EpayCheckReducer.viewModal); 
    const viewModal2        = useSelector((state) => state.EpayCheckReducer.viewModal2); 
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
        { id:"check_status_date", label:"Status Date", align:"left"},
    ];

    const status = [ 
        { status:true , description: 'ON-HAND'},
        { status:true  , description: 'DEPOSITED'},
        { status:true  , description: 'TRANSMITTED'},
        { status:false  , description: 'REJECTED'},
    ]

    const epay_selection = [
      {  description:'NO'},
      {  description:'YES'}
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

      // ADD CHECK START FUNCTION AND PROCESS
      const onClickOpenViewModalDeposit = () => {
          dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
              viewModal: true,
              },
          }); 
      };
      const onClickCloseViewModalDeposit = () => {
          dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
              viewModal: false,
              selectedItem: {}
              },
          });
      };

      const handleChangePage = (event, newPage) => {
        setSearchParams({  
          q  : search,
          p  : page == null ? 1 : newPage,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : filterStatus,
          sc : filterSubSection
        });
      };

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
        
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedDataList: [], 
          },
        })
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

      const onUpdateCheckDetails = async (data, values) => {
        try {
          const isConfirm = await swal({
            title: "Change Status",
            text: `Do you want to update the status from ${data['check_status']} to ${values}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          });
          if (isConfirm) {
            const res = await dispatch(postCheckDetailsStatus({...data, status: values})); 
            if (res) {  
              await swal(res.title, res.message, res.status);
              GetChequeList();
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

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
      
      const updateStatus = async (data) => { 
        // Check if any checks are selected
        if (data.code.length === 0) {
          await swal("Error", `Please select at least one check to ${data?.status.toLowerCase()}`, "error");
          return;
        }
      
        try {
          // Ask for confirmation before proceeding
          const isConfirm = await swal({
            title: data?.status,
            text: `Are you sure you want to proceed with ${data?.status}? `,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          });
      
          if (isConfirm) {
            // Dispatch the action to update the status
            const res = await dispatch(postCheckDetailsStatus(data));
      
            // Handle the response
            if (res) {  
              await swal(res.title, res.message, res.status); 
              dispatch({
                type: Constants.ACTION_EPAY_CHECK,
                payload: {
                  selectedDataList: [],
                  refresh: !state.refresh,
                  viewModal: false
                },
              })
              // clear search
              setSearchParams({
                q  : "", 
                p  : page == null ? 1 : page,
                df : filterStartQuery,
                dt : filterEndQuery,
                s  : filterStatus, 
                sc : filterSubSection
              });
            }
          } else {

          }

        } catch (error) {
          console.error("Error updating status:", error); // Use console.error for errors
          swal("Oops!", "Something went wrong, please try again!", "error");
        }
      };
      
      const onClickTransmit = async () => {
        const data = {
          status: "TRANSMITTED",
          code: selectedDataList,
        }
        await updateStatus(data);
      };
       

      const onClickUndo = async () => {
        const data = {
          status: "UNDO",
          code: selectedDataList, 
        }
        await updateStatus(data);
      };

      const onClickReject = async () => {
        const data = {
          status: "REJECTED",
          code: selectedDataList, 
        }
        await updateStatus(data);
      };
     
      const onClickOpenEditModal = async  (row)=> {
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedItem: row,
            editModal: true,
          },
        });
      };
      const onClickCloseEditModal = () => {
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            editModal: false,
          },
        });
      };

      const onClickOpenRejectModal = async  ()=> { 
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            viewModal2: true,
          },
        });
      };
      const onClickCloseRejectModal = () => {
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            viewModal2: false,
          },
        });
      };
      
   
    return {
        viewModal2,
        epay_selection,
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
        status,
        selectedItem,
        bank_accounts,
        filterStatus,
        selectedDataList,
        editModal,
        onChangeSearch,
        onClickOpenViewModalDeposit,
        onClickCloseViewModalDeposit,
        handleChangePage,
        onChangeFilterStart,
        onChangeFilterEnd,
        onChangeFilterStatus,
        onChangeFilteSubsection,
        onUpdateCheckDetails, 
        handleCheckboxChange,
        onClickTransmit, 
        onClickReject,
        onClickOpenEditModal,
        onClickCloseEditModal,
        onClickUndo,
        onClickOpenRejectModal,
        onClickCloseRejectModal
    };
};

export default CheckMonitoringHooks;
