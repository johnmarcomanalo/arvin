import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useDebounce } from "utils/HelperUtils";
import { useSearchParams, useNavigate } from "react-router-dom";
import { reset } from "redux-form";
import { Constants } from "reducer/Contants";
import { decryptaes } from "utils/LightSecurity";
import { cancelRequest } from "api/api";
import { 
  getCheckCustomer,
} from "../actions/CheckCollectionActions";
import swal from "sweetalert"; 
const CheckCustomerHooks = (props) => {
  const navigate          = useNavigate();
  const refresh           = useSelector((state) => state.EpayCheckReducer.refresh);
  const dispatch          = useDispatch();
  const [
      searchParams, 
      setSearchParams
  ] = useSearchParams();
  const search            = searchParams.get("q") != null ? String(searchParams.get("q")) : ""; 
  const page              = searchParams.get("p") != null ? searchParams.get("p") : 1;
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
      u: user_code,
      q: search,
      p: page == null ? 1 : page,
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
        u: user_code, 
        q: search,
        p: 1,
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
    setSearchParams({
      u: user_code, 
      q: search,
      p: page == null ? 1 : newPage,
    });
  };
  
  return { 
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
    
  };
};

export default CheckCustomerHooks;
