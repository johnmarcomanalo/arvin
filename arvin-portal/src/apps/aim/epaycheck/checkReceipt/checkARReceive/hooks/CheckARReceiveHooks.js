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
  getCheckReceivedBy,
  postAppliedAR,
  postReceivedCheckByArAt,
} from "../../checkMonitoring/actions/CheckMonitoringAction"
import swal from "sweetalert";
let formName = "CheckCollection"
const CheckARReceiveHooks = (props) => {  
    const navigate         = useNavigate();
    const dispatch         = useDispatch();
    const [searchParams, setSearchParams]   
                           = useSearchParams();
    const account_details  = useSelector((state) => state.AuthenticationReducer.account_details);
    const account_access   = useSelector((state) => state.AuthenticationReducer.access);
    const account_organization_rights = account_access.user_access_organization_rights;
    const search           = searchParams.get("q")  != null ? String(searchParams.get("q")) : "";
    const page             = searchParams.get("p")  != null ? searchParams.get("p") : 1;
    const filterStartQuery = searchParams.get("df") != null ? String(searchParams.get("df")): moment(new Date()).format("YYYY-MM-DD");
    const filterEndQuery   = searchParams.get("dt") != null ? String(searchParams.get("dt")): moment(new Date()).format("YYYY-MM-DD");
    const filterStatus     = searchParams.get("s")  != null ? String(searchParams.get("s")) : "TRANSMITTED";
    const filterReceivedBy = searchParams.get("r")  != null ? String(searchParams.get("r")) : "BILLING";
    const filterSubSection = searchParams.get("sc") != null ? String(searchParams.get("sc")) : account_details.subsection_code;
    const filterSubSectionName = searchParams.get("scn") != null ? String(searchParams.get("scn")) : (
                                account_organization_rights.find(
                                  item => item.code === account_details.subsection_code
                                )?.description || ""
                              );
    const debounceSearch   = useDebounce(searchParams, 100);
    const access           = useSelector((state) => state.AuthenticationReducer.access); 
    const selectedItem     = useSelector((state) => state.EpayCheckReducer.selectedItem); 
    const dataList         = useSelector((state) => state.EpayCheckReducer.dataList);
    const dataListCount    = useSelector((state) => state.EpayCheckReducer.dataListCount);
    const viewModal        = useSelector((state) => state.EpayCheckReducer.viewModal);
    const viewModal2        = useSelector((state)=> state.EpayCheckReducer.viewModal2); 
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
        { id:"number", label:"#", align:"left"},
        { id:"received_check_by_ar_at", label:"Received Date of AR", align:"left"},
        { id:"applied_at", label:"Applied At", align:"left"},
        { id:"username", label:"Username", align:"left"},
        { id:"received_date", label:"Received Date", align:"left"},
        { id:"check_status_date", label:"Transmitted Date", align:"left"},
        { id:"card_name", label:"Customer", align:"left"},
        { id:"check_number", label:"Check Number", align:"left"},
        { id:"check_date", label:"Check Date", align:"left"},
        { id:"check_amount_display", label:"Check Amount", align:"left"},
        { id:"account_number", label:"Account Number", align:"left"},
        { id:"bank_description", label:"Bank", align:"left"},
        { id:"bank_branch", label:"Bank Branch", align:"left"},
        { id:"advance_payment", label:"Adv Payment", align:"left"},
        { id:"prefix_crpr", label:"CR/PR", align:"left"},
        { id:"sales_invoice", label:"Sales Invoice", align:"left"},
        { id:"dr_number", label:"DR Number", align:"left"},
    ];

    const status = [ 
      { status:true , code:'TRANSMITTED', description: 'TRANSMITTED'},
      { status:false  , code:'RECEIVED', description: 'RECEIVED BY AR'},
    ]

    const receivedBy = [
      { status:true, description: 'BILLING'},
      { status:false, description: 'COLLECTOR'},
      { status:false, description: 'GENERAL ACCNT'},
    ]


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
    
      const others = sortByDescription(
        data.filter(
          (item) =>
            item.department_description !== "Manila Branch" &&
            item.department_description !== "Provincial"
        )
      );
    
      const result = [];
    
      if (provincial.length > 0) {
        result.push({ code: "Provincial", description: "- ALL PROVINCE" }, ...provincial);
      }
    
      if (manila.length > 0) {
        result.push({ code: "Manila Branch", description: "- ALL MANILA" }, ...manila);
      }
    
      if (others.length > 0) {
        result.push({ code: "Manila Branch", description: "- ALL OTHERS" }, ...others);
      }
    
      return result;
    };

    const warehouseList = groupedSorted(access.user_access_organization_rights); 
  
    const getListParam = () => {
      const data = { 
        p  : page == null ? 1 : page,
        q  : search,
        df : filterStartQuery,
        dt : filterEndQuery,
        s  : filterStatus,
        sc : filterSubSection,
        r  : filterReceivedBy,
        scn: filterSubSectionName
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
           dispatch(getCheckReceivedBy(data));
        }, state.debounceDelay);
      } catch (error) {
        await console.error(error);
      }
    };

    React.useEffect(() => { 
      props.initialize({ 
        filter_date_start: filterStartQuery,
        filter_date_end: filterEndQuery,
        filter_status: filterStatus,
      });
       GetChequeList();
         return () => cancelRequest(); 
    }, [refresh,debounceSearch]);
      
      const onChangeSearch = (event) => { 
        const search = event.target.value;
        setSearchParams({ 
          q  : search,
          p  : page,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : filterStatus,
          sc : filterSubSection,
          r  : filterReceivedBy,
          scn: filterSubSectionName
        });
      };

      const onChangeFilterSubsection = (subsection,subsectionName) => {
        setSearchParams({
          q  : search, 
          p  : 1,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : filterStatus, 
          sc : subsection,
          r  : filterReceivedBy,
          scn: subsectionName
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
          p  : 1,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : status,
          sc : filterSubSection,
          r  : filterReceivedBy,
          scn: filterSubSectionName
        });
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedDataList: [], 
          },
        })
      };


      const onChangeFilterStart = (date) => {
          const newdate = moment(date).format("YYYY-MM-DD");
          setSearchParams({
            q  : search, 
            p  : page == null ? 1 : page,
            df : newdate,
            dt : filterEndQuery,
            s  : filterStatus, 
            sc : filterSubSection,
            r  : filterReceivedBy,
            scn: filterSubSectionName
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
          sc : filterSubSection,
          r  : filterReceivedBy,
          scn: filterSubSectionName
        });
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
          received_check_by_ar_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          received_check_by: account_details.code,
          status: values.status

        };
        const res = await swal({
          title: `${values.status === 'YES' ? 'Receive' : 'Undo Received'} Check`,
          text: `Are you sure you want to ${values.status === 'YES' ? 'receive' : 'undo receipt of'} these ${selectedDataList.length} checks?`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
        
        if (res) {
          try {
            const res = await dispatch(postReceivedCheckByArAt(data));
           
            dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                refresh: !refresh,
                selectedDataList: [], 
              },
            })
            await swal(res.title, res.message, res.status);
            // getCheckReceivedBy()
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
        dispatch({
          type: Constants.ACTION_EPAY_CHECK,
          payload: {
            selectedDataList: checked
              ? [...selectedDataList, row.code] // ✅ Push new item
              : selectedDataList.filter((code) => code !== row.code) // ✅ Remove item
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
          sc : filterSubSection,
          r  : filterReceivedBy,
          scn: filterSubSectionName
        });
      };

      const updateApplyAR = async (values) => {
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
          applied_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          applied_by: account_details.code,
          status: values.status

        };
        const res = await swal({
          title: `${values.status === 'YES' ? 'Apply' : 'Undo Apply '} Check`,
          text: `Are you sure you want to ${values.status === 'YES' ? 'apply' : 'undo apply of'} these ${selectedDataList.length} checks?`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
        
        if (res) {
          try {
            const res = await dispatch(postAppliedAR(data));
           
            dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                refresh: !refresh,
                selectedDataList: [], 
              },
            })
            await swal(res.title, res.message, res.status);
            // getCheckReceivedBy()
          } catch (error) {
            await console.error(error);
          }
        }
      }

      const onClickApplyAR = () =>{
        updateApplyAR({status:'YES'})
      }
      
      const onClickUndoApplyAR = () =>{
        updateApplyAR({status:'NO'})
      }

      const onChangeFilterReceivedBy = (received) => {
        
        setSearchParams({
          q  : search, 
          p  : page == null ? 1 : page,
          df : filterStartQuery,
          dt : filterEndQuery,
          s  : filterStatus, 
          sc : filterSubSection,
          r  : received,
          scn: filterSubSectionName
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

    const reloadData = () =>{
      GetChequeList();
    }
    
   
    return {
        viewModal2,
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
        status,
        receivedBy,
        filterReceivedBy,
        filterSubSectionName,
        warehouseList,
        onChangeSearch,
        onChangeFilterSubsection,
        onClickOpenReceiveModal,
        onClickCloseReceiveModal,
        handleCheckboxChange,
        onClickReceive,
        onClickUndoReceive,
        onChangeFilterStart,
        onChangeFilterEnd,
        onChangeFilterStatus,
        handleChangePage,
        onClickApplyAR,
        onChangeFilterReceivedBy,
        onClickOpenRejectModal,
        onClickCloseRejectModal,
        reloadData
      };
};

export default CheckARReceiveHooks;
