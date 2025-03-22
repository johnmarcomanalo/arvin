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
  getCheckForApproval,
  getCheckApprovalDetails,
  postCheckForApproval,
} from "../../checkMonitoring/actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "CheckCollection"
const CheckForApprovalHooks = (props) => {  
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const [searchParams, setSearchParams]   
                           = useSearchParams();
    const account_details  = useSelector((state) => state.AuthenticationReducer.account_details);
    const access           = useSelector((state) => state.AuthenticationReducer.access); 
    const search           = searchParams.get("q")  != null ? String(searchParams.get("q")) : "";
    const page             = searchParams.get("p")  != null ? searchParams.get("p") : 1;
    const filterStatus     = searchParams.get("s")  != null ? String(searchParams.get("s")) : "PENDING";
    const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : (access.user_access_organization_rights.length > 0 ? "All" :  account_details.subsection_code); 
    const debounceSearch   = useDebounce(searchParams, 100);
    const selectedItem     = useSelector((state) => state.EpayCheckReducer.selectedItem); 
    const dataList         = useSelector((state) => state.EpayCheckReducer.dataList);
    const dataList2         = useSelector((state) => state.EpayCheckReducer.dataList2);
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
      { id:"bank_branch", label:"Bank Branch", align:"left"},
      { id:"crpr", label:"CR/PR", align:"left"},
      { id:"remarks", label:"Remarks", align:"left"},
      { id:"check_status_date", label:"Status Date", align:"left"},
    ];
    const columns2 = [
      { id:"sales_invoice", label:"Sales Invoice", align:"left"},
      { id:"dr_number", label:"DR Number", align:"left"},
      { id:"doc_date", label:"Document Date", align:"left"},
      { id:"doc_number", label:"Document No.", align:"left"},
      { id:"bp_payment_term", label:"Payment Term", align:"left"},
      { id:"internal_approved_term", label:"Approved Term", align:"left"},
      { id:"doc_total", label:"Doc Total", align:"left"},
    ]

    const statusList = [
      { description:"PENDING"},
      { description:"APPROVED"},
      { description:"DISAPPROVED"},
    ];
    const user_access_organization_rights = access.user_access_organization_rights;
    const warehouse =  [
      { code: "All", description: "All" }, // Add "All" option
      ...user_access_organization_rights
    ];
  
    const getListParam = () => {
      const data = { 
        p  : page == null ? 1 : page,
        q  : search,
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
           dispatch(getCheckForApproval(data)); 
        }, state.debounceDelay);
      } catch (error) {
        await console.error(error);
      }
    };

    React.useEffect(() => { 
      props.initialize({
        filterStatus: filterStatus,
      });
       GetChequeList(); 
        return () => cancelRequest(); 
    }, [refresh,debounceSearch,selectedItem]);

    React.useEffect(() => {
    props.initialize({
      filterSubSection: "All"
    })
    }, [])
      
      const onChangeSearch = (event) => { 
        const search = event.target.value;
        setSearchParams({ 
          q  : search,
          p  : page,
          s  : filterStatus,
          sc : filterSubSection
        });
      };

      const onChangeFilteSubsection = (subsection) => {
        setSearchParams({
          q  : search, 
          p  : page == null ? 1 : page,
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

  
      const onChangeFilterStatus = (status) => { 
        setSearchParams({
          q  : search, 
          p  : page == null ? 1 : page,
          s  : status, 
          sc : filterSubSection
        });
      };

     
      const updateRequestStatus = async (values) => {
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
          request_status:values.request_status
        };
        let text = ""
        switch (values.request_status) {
          case "APPROVED":
            text = `Are you sure you want to approve these checks?`
            break;
          case "DISAPPROVED":
            text = `Are you sure you want to disapprove these checks?`
            break;
          case "UNDO":
            text = `Are you sure you want to set these checks to undo?`
            break;
          default:
            text = ""
            break;
        }
        // const res = await swal({
        await swal({
          title: `Selected ${selectedDataList.length} checks?`,
          text: text,
          icon: "warning",
          buttons: true,
          dangerMode: true,
          closeOnClickOutside: false,
        });
        
        // if (res) {
          // try {
            console.log(data)
            const res = await dispatch(postCheckForApproval(data));
            // window.location.reload()
            await dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                refresh: !refresh,
                selectedDataList: [], 
              },
            })
            
            
          // } catch (error) {
          //   await console.error(error);
          // }
        // }
      }

      const onClickApprove = async () =>{
        updateRequestStatus({request_status:'APPROVED'})
      }


      const onClickDisapprove = async () =>{
        updateRequestStatus({request_status:'DISAPPROVED'})
      }

      const onClickUndo = async () =>{ 
        updateRequestStatus({request_status:'PENDING'})
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

        // ADD CHECK START FUNCTION AND PROCESS
      const onClickOpenViewRemarksModal = (data) => {
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              viewModal: true,
              selectedItem:data
            },
        });  
        dispatch(getCheckApprovalDetails({c: data.code}))
      };
      const onClickCloseViewRemarksModal = () => {
          dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
              viewModal: false, 
              },
          });
      }; 

      const onClickFunc = (row) => {
       if(filterStatus === "PENDING"){
         onClickOpenViewRemarksModal(row)
        }else{
          onClickOpenEditModal(row)
       }
      };

      const onClickOpenEditModal = async  (row)=> {  
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            editModal: true,
            selectedItem: row,
          },
        });
      };
      const onClickCloseEditModal = async  ()=> { 
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            editModal: false,
            selectedItem: {},
          },
        });
      };
    
    return {
        dataList2,
        viewModal, 
        state,
        account_details,
        columns2,
        columns, 
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
        statusList,
        warehouse,
        filterSubSection,
        user_access_organization_rights,
        onChangeSearch,
        onChangeFilteSubsection,
        handleCheckboxChange,
        onClickApprove, 
        onClickDisapprove,
        onChangeFilterStatus,
        onClickOpenViewRemarksModal,
        onClickCloseViewRemarksModal,
        onClickUndo,
        onClickFunc,
        onClickOpenEditModal,
        onClickCloseEditModal
    };
};

export default CheckForApprovalHooks;
