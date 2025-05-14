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
    postCheckDetailsReceive,
    postCheckRejectToClose
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
    const viewModal2        = useSelector((state)=> state.EpayCheckReducer.viewModal2); 
    const editModal        = useSelector((state) => state.EpayCheckReducer.editModal); 
    const rejectCloseModal = useSelector((state) => state.EpayCheckReducer.rejectCloseModal); 
    const bank_accounts    = useSelector((state) => state.ReferenceReducer.bank_accounts)?.sort((a, b) => a.description.localeCompare(b.description));
    const refresh          = useSelector((state) => state.EpayCheckReducer.refresh);
    const selectedDataList = useSelector((state) => state.EpayCheckReducer.selectedDataList);
    const banks            = useSelector((state) => state.ReferenceReducer.phbanks); 
    const [state, setState]= React.useState({
        debounceTimer: null,
        debounceDelay: 1000,
        selectedCheck:[],
        sort_by: "check_status", // Default sorting order
        order: "asc", // Default sorting field
    });
    const subsection_allowed_to_reject = [12,8];
    const columns = [
        { id:"code", label:"Reference", align:"left", sortable: false},
        { id:"created_at", label:"Created At", align:"left", sortable: true},
        { id:"status", label:"Status", align:"left", sortable: false},
        { id:"stale_check_view", label:"Stale Check", align:"left", sortable: false},
        { id:"card_code", label:"Customer Code", align:"left", sortable: false},
        { id:"card_name", label:"Customer", align:"left", sortable: true},
        { id:"account_number", label:"Account No.", align:"left", sortable: true},
        { id:"check_number", label:"Check No.", align:"left", sortable: true},
        { id:"check_date", label:"Check Date", align:"left", sortable: true},
        { id:"check_amount_display", label:"Check Amount", align:"left", sortable: true},
        { id:"bank_description", label:"Bank", align:"left", sortable: true},
        { id:"bank_branch", label:"Bank Branch", align:"left", sortable: true},
        { id:"advance_payment", label:"Adv Payment", align:"left", sortable: false},
        { id:"deposited_bank", label:"Bank Deposited", align:"left", sortable: true},
        { id:"prefix_crpr", label:"CR/PR", align:"left", sortable: true},
        { id:"sales_invoice", label:"Sales Invoice", align:"left", sortable: false},
        { id:"dr_number", label:"DR Number", align:"left", sortable: false},
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
        sc : filterSubSection,
        sort_by: state.sort_by,
        order: state.order,
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
       GetChequeList();
         return () => cancelRequest(); 
    // }, [refresh,search,filterStartQuery,filterEndQuery,filterStatus,selectedDataList,page]);
  }, [refresh,debounceSearch,selectedDataList]);

      React.useEffect(() => { 
        props.initialize({ 
          filter_date_start: filterStartQuery,
          filter_date_end: filterEndQuery,
          filterStatus: filterStatus,
        });
      }, []);
      
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
          if (!hasSelectedChecks()) return;
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
        setState((prevState) => ({
          ...prevState,
          sort_by: "check_status",
          order: "asc",
        }));
      };

      const onChangeFilterStart = (date) => {
          const newdate = moment(date).format("YYYY-MM-DD");
          setSearchParams({
            q  : search, 
            p  : "1",
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
          p  : 1,
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
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedDataList: checked
              ? [...selectedDataList, row.code] // ✅ Push new item
              : selectedDataList.filter((code) => code !== row.code) // ✅ Remove item
          },
        });
      };
      
      const updateStatus = async (data) => { 
       
        // Check if any checks are selected
        if (!hasSelectedChecks()) return;

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
      
        try {
          // Ask for confirmation before proceeding
          const isConfirm = await swal({
            title: stts,
            text: `Are you sure you want to proceed with ${stts}? `,
            icon: "info",
            buttons: true,
            dangerMode: true,
            closeOnClickOutside: false,
          });
      
          if (isConfirm) {
            // Dispatch the action to update the status
            const res = await dispatch(postCheckDetailsStatus(data));
      
            // Handle the response
            if (res) {  
              await dispatch({
                type: Constants.ACTION_EPAY_CHECK,
                payload: {
                  selectedDataList: [],
                  refresh: !refresh,
                  viewModal: false
                },
              })
              await swal(res.title, res.message, res.status);  
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


      const onClickOpenCloseRejectedModal = async  (row)=> {
        if(row?.status === "CLOSED"){
          swal("Information", "Check is already closed", "info");
          return;
        }
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedItem: row,
            rejectCloseModal: true,
          },
        });
      };
      const onClickCloseCloseRejectedModal = () => {
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            rejectCloseModal: false,
          },
        });
      };

      const onClickOpenRejectModal = async  ()=> { 
        if (!hasSelectedChecks()) return;
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

      const hasSelectedChecks = () => {
        if (selectedDataList.length === 0) {
          swal("Information", "Please select at least one check", "info");
          return false; // Return false to indicate no selection
        }
        return true; // Return true if selection exists
      }    


      const onClickRejectToClose = async (values) => {
       
            const value = {
              code: selectedItem?.code,
              rejected_reference: values.rejected_reference, 
            }

            const isConfirm = await swal({
              title: "For Close",
              text: `Are you sure you want to proceed with the close action? `,
              icon: "info",
              buttons: true,
              dangerMode: true,
              closeOnClickOutside: false,
            });
            
            if (isConfirm) {
            const res = await dispatch(postCheckRejectToClose(value));
            if (res) { 
              if(res.result){
                dispatch({
                  type: Constants.ACTION_EPAY_CHECK,
                  payload: {
                    rejectCloseModal: false,
                    refresh: !refresh,
                    selectedDataList: [],
                  },
                }); 
              }
              await swal(res.title, res.message, res.status);
            }
          }


      }

      
  const onChangeSorting = (field, direction) => { 
    setState((prevState) => ({
      ...prevState,
      sort_by: field,
      order: direction,
    }));
  
    setSearchParams({
      q  : search, 
      p  : page == null ? 1 : page,
      df : filterStartQuery,
      dt : filterEndQuery,
      s  : filterStatus, 
      sc : filterSubSection,
      sort_by: field,
      order: direction,
    });

    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        selectedDataList: [], 
      },
    })
   
  };
  
       
   
    return {
        banks,
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
        subsection_allowed_to_reject,
        rejectCloseModal,
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
        onClickCloseRejectModal,
        onClickRejectToClose,
        onClickOpenCloseRejectedModal,
        onClickCloseCloseRejectedModal,
        onChangeSorting
    };
};

export default CheckMonitoringHooks;
