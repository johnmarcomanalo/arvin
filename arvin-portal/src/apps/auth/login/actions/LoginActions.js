import { loginApi, post, postNoToken } from "../../../../api/api";
import { Constants } from "../../../../reducer/Contants";
import { decryptLocal, encryptLocal } from "../../../../utils/Encryption";
import { decryptaes } from "../../../../utils/LightSecurity";
import { login } from "../services/loginService";
export const onLogin = (values) => async (dispatch) => {
  const res = await loginApi("login", values);
  return res;
};

export const forgotPassword = (values) => async (dispatch) => {
  const res = await postNoToken("forgot-password/", values);

  return res;
};

export const loginUser = (formValues) => async (dispatch) => {
  if (formValues.username == null || formValues.password == null) return false;
  const response = login(formValues);
  return response;
};
