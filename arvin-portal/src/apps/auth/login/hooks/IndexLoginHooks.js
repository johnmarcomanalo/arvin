import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { LoginConstants } from "../constants/Constants";
const IndexLoginHooks = (props) => {
  const dispatch = useDispatch();
  const { type } = useParams();
  const userAccountDetails = useSelector(
    (state) => state.LoginReducer.user
  );
  const openForgotPasswordModal = useSelector(
    (state) => state.LoginReducer.openForgotPasswordModal
  );

  let user_type = "";
  switch (type) {
    case "service_provider":
      user_type = "Service Provider";
      break;
    case "service_administrator":
      user_type = "Service Administrator";
      break;
    case "service_client":
      user_type = "Service Client";
      break;
    default:
      break;
  }
  useEffect(() => {
    props.initialize({ user_type: user_type });
  }, []);

  const onOpenForgotPasswordModal = () => {
    dispatch({
      type: LoginConstants.ACTION_LOGIN_CONSTANT,
      payload: {
        openForgotPasswordModal: true,
      },
    });
  };

  const onCloseForgotPasswordModal = () => {
    dispatch({
      type: LoginConstants.ACTION_LOGIN_CONSTANT,
      payload: {
        openForgotPasswordModal: false,
      },
    });
  };
  return {
    onOpenForgotPasswordModal,
    onCloseForgotPasswordModal,
    user_type,
    type,
    userAccountDetails,
    openForgotPasswordModal,
  };
};

export default IndexLoginHooks;

export const onLoginDetailToLoginReducer =
  (values) => async (dispatch) => {
    localStorage.setItem("userData", JSON.stringify(values));
    // window.location.href = "/";
    await dispatch({
      type: LoginConstants.ACTION_LOGIN_CONSTANT,
      payload: { user: values },
    });
  };
