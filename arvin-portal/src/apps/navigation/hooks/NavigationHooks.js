import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cancelRequest } from "../../../api/api";
import { Constants } from "../../../reducer/Contants";
const NavigationHooks = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const request_modal = useSelector(
    (state) => state.NavigationReducer.request_modal
  );
  const request_type = useSelector(
    (state) => state.NavigationReducer.request_type
  );
  const token = useSelector((state) => state.AuthenticationReducer.token);
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const onOpenRequestModal = (type) => {
    dispatch({
      type: Constants.ACTION_NAVIGATION,
      payload: {
        request_modal: true,
        request_type: type,
      },
    });
  };
  const onCloseRequestModal = () => {
    dispatch({
      type: Constants.ACTION_NAVIGATION,
      payload: {
        request_modal: false,
        request_type: "",
      },
    });
  };
  React.useEffect(() => {
    if (
      typeof token === "undefined" &&
      typeof account_details === "undefined"
    ) {
      localStorage.clear();
      navigate("/login");
    }
    return () => cancelRequest();
  }, []);
  return {
    request_modal,
    request_type,
    access,
    onOpenRequestModal,
    onCloseRequestModal,
  };
};

export default NavigationHooks;
