import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cancelRequest } from "../../../api/api";
import { Constants } from "../../../reducer/Contants";
import { encryptaes } from "../../../utils/LightSecurity";
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
  const active_page = useSelector(
    (state) => state.AuthenticationReducer.active_page
  );
  const setting_modal = useSelector(
    (state) => state.NavigationReducer.setting_modal
  );
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
  const onOpenSettingModal = () => {
    dispatch({
      type: Constants.ACTION_NAVIGATION,
      payload: {
        setting_modal: true,
      },
    });
  };
  const onCloseSettingModal = () => {
    dispatch({
      type: Constants.ACTION_NAVIGATION,
      payload: {
        setting_modal: false,
      },
    });
  };
  const onSelectActivePage = (data) => {
    localStorage.setItem("active_page", encryptaes(JSON.stringify(data)));
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
    setting_modal,
    request_type,
    access,
    account_details,
    active_page,
    onOpenRequestModal,
    onCloseRequestModal,
    onOpenSettingModal,
    onCloseSettingModal,
    onSelectActivePage,
  };
};

export default NavigationHooks;
