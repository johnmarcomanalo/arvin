import { cancelRequest } from "api/api";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Constants } from "reducer/Contants";
import swal from "sweetalert";
import { useDebounce } from "utils/HelperUtils";
import {
  getCheckCustomer,
} from "../actions/CheckCollectionActions";
const CheckCustomerHooks = (props) => {
  const navigate          = useNavigate();
  const refresh           = useSelector((state) => state.EpayCheckReducer.refresh);
  const dispatch          = useDispatch();
  const [
      searchParams, 
      setSearchParams
  ] = useSearchParams();
  const search            = searchParams.get("query") != null ? String(searchParams.get("query")) : ""; 
  const page              = searchParams.get("page") != null ? searchParams.get("page") : 1;
  const debounceSearch    = useDebounce(searchParams, 500);
  const account_details   = useSelector((state) => state.AuthenticationReducer.account_details); 
  const dataList          = useSelector((state) => state.EpayCheckReducer.dataList2);
  const dataListCount     = useSelector((state) => state.EpayCheckReducer.dataListCount2);
  const viewModal         = useSelector((state) => state.EpayCheckReducer.viewModal); 
  const user_code         = account_details.code
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 1000,
    invoice_list: [],
  }); 

  const columns = [
    { id: "cardname", label: "Customer Name", align: "left" },
    { id: "cardcode", label: "Customer Code", align: "left" },
  ];

  const getListParam = () => {
    const data = {
      uc: user_code,
      query: search,
      page: page == null ? 1 : page,
    };
    return data;
  };

  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };

  const GetCheckCustomerList = async () => {
    try {
      const data = getListParam();
      await debounce(() => {
        dispatch(getCheckCustomer(data));
      }, state.debounceDelay);
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => {
    GetCheckCustomerList();
    return () => cancelRequest();
  }, [refresh,page,search]);

  const onChangeSearch = (event) => {
    const search = event.target.value;
    setSearchParams({
        uc: user_code, 
        query: search,
        page: 1,
    });
  };

  // ADD CHECK START FUNCTION AND PROCESS
  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        viewModal: false,
      },
    });
  }; 

  const handleChangePage = (event, newPage) => { 
    console.log("handleChangePage",event,newPage);
    setSearchParams({
      uc: user_code, 
      query: search,
      page: newPage,
    });
  };

  const onClickGetCustomer = (value) =>{  
    dispatch({
      type: Constants.ACTION_EPAY_CHECK,
      payload: {
        selectedItem: {
          ...value
        }, 
        viewModal3: false,
      },
    });
    swal("Success", "Customer Details has been selected", "success", {
      buttons: false,
      timer: 1000,
    });
  }
  
  return {
    page,
    columns,
    viewModal,  
    dataList,
    dataListCount, 
    dispatch,
    setSearchParams, 
    handleChangePage,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeSearch,
    onClickGetCustomer,
    
  };
};

export default CheckCustomerHooks;
