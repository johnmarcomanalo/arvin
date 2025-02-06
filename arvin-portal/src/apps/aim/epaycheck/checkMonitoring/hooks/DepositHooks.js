import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import React,{ useState, useEffect } from "react"; 
import { useDebounce } from "../../../../../utils/HelperUtils";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form";
import { Constants } from "../../../../../reducer/Contants";
import { decryptaes } from "../../../../../utils/LightSecurity";
import { cancelRequest } from "../../../../../api/api";
import {
  getAllRefBankAccounts,
} from "../../../settings/reference/actions/ReferenceActions";
import {
    getCheckDetails,
    postCheckDetailsStatus,
} from "../actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "Deposit";
const DepositHooks = (props) => {  
  console.log("HOOKS",props.refresh);
  
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const viewModal        = useSelector((state) => state.EpayCheckReducer.viewModal); 
    const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
    const bank_accounts    = useSelector((state) => state.ReferenceReducer.bank_accounts); 
    const selectedDataList = useSelector((state) => state.EpayCheckReducer.selectedDataList); 
   
    React.useEffect(() => { 
      props.initialize({  
        deposited_date: moment(new Date()).format("YYYY-MM-DD"),
        code: selectedDataList
      });
      dispatch(getAllRefBankAccounts());
          return () => cancelRequest();
    },[props.code]);

    const submit = async (values,dispatch) => { 

      const data = {
        status: "DEPOSITED",
        code: selectedDataList,
        deposited_date: values?.deposited_date, 
        bank_deposit: values?.bank_deposit
      }
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
            await dispatch({
                type: Constants.ACTION_EPAY_CHECK,
                payload: {
                  selectedDataList:[],
                  refesh: !refresh,
                  viewModal: false, // Open the deposit modal
                },
            }); 
          }
        }  

       
       
      } catch (error) {
        console.error("Error updating status:", error); // Use console.error for errors
        swal("Oops!", "Something went wrong, please try again!", "error");
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
      bank_accounts, 
      clickDepositedModal,
      submit
    };
};

export default DepositHooks;
