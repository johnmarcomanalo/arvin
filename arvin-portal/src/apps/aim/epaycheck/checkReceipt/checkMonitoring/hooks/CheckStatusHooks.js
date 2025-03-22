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
    postCheckRejectToClose,
} from "../actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "Deposit";
const CheckStatusHooks = (props) => {
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const viewModal        = useSelector((state) => state.EpayCheckReducer.viewModal); 
    const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
    const bank_accounts    = useSelector((state) => state.ReferenceReducer.bank_accounts); 
    const selectedDataList = useSelector((state) => state.EpayCheckReducer.selectedDataList);
    const reject_remarks = [
      { description: 'RETURNED TO CLIENT' },
      { description: 'WRONG ENCODING BY CLERK' }, 
    ];
    React.useEffect(() => {
      props.initialize({
        code: selectedDataList, 
        deposited_bank: "", 
        rejected_remarks: "",
      });
      dispatch(getAllRefBankAccounts());
      return () => cancelRequest();
    },[refresh,props.code]);

    const submit = async (values,dispatch) => {  
 
      const data = {
        status: values.status, 
        code: values.code,
        deposited_date: values?.deposited_date, 
        deposited_bank: values?.deposited_bank,
        rejected_date: values?.rejected_date,
        rejected_remarks: values?.rejected_remarks
      }
      let stts = ''
      switch (data?.status) {
        case 'APPROVED':
          stts = 'APPROVE'
          break;
        case 'DEPOSITED':
          stts = 'DEPOSIT'
          break;
        case 'TRANSMITTED':
          stts = 'TRANSMIT'
          break;
          case 'REJECTED':
            stts = 'REJECT'
            break;
        default:
          stts='UNDO'
          break;
      } 
      // Check if any checks are selected
      if (data.code.length === 0) {
        await swal("Information", `Please select at least one check to ${data?.status.toLowerCase()}`, "info");
        return;
      } 
      try {
        // Ask for confirmation before proceeding
        const isConfirm = await swal({
          title: stts,
          text: `Are you sure you want to proceed with ${stts}? `,
          icon: "info",
          buttons: true,
          dangerMode: true,
        });
    
        if (isConfirm) {
         
          // Dispatch the action to update the status
          const res = await dispatch(postCheckDetailsStatus(data));
    
          // Handle the response
          if (res) {
            dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                selectedDataList:[],
                refesh: !refresh,
                viewModal: false, // Open the deposit modal
                viewModal2: false
              },
            });
            await swal(res.title, res.message, res.status);  
            if (res.status === "error") {
              window.location.reload();
            }
          }
        }  

       
       
      } catch (error) {
        console.error("Error updating status:", error); // Use console.error for errors
        swal("Oops!", "Something went wrong, please try again!", "warning");
      }
    }; 
    const clickDepositedModal = async () => { 
      dispatch({
        type: Constants.ACTION_EPAY_CHECK,
        payload: {
          viewModal: true, // Open the deposit modal
        },
      });
    }; 

    
    return {
      reject_remarks,
      bank_accounts, 
      clickDepositedModal,
      submit
    };
};

export default CheckStatusHooks;
