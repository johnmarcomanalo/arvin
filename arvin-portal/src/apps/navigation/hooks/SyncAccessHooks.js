import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cancelRequest } from "../../../api/api";
import { Constants } from "../../../reducer/Contants";
import { encryptaes } from "../../../utils/LightSecurity";
const SyncAccessHooks = (props) => {
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const initialization = async () => {
    try {
      props.initialize({
        code: account_details?.code,
      });
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    initialization();
  }, []);
  return {
    account_details,
  };
};

export default SyncAccessHooks;
