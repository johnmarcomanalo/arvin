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

export function loginUser(formValues, dispatch, props) {
  if (formValues.username == null || formValues.password == null) return false;
  const response = login(formValues);
  // Loading();
  return response
    .then((response) => {
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("account_details", response.data.user);

      dispatch({
        type: Constants.ACTION_AUTHENTICATION,
        payload: {
          token: response.data.token,
          account_details: decryptaes(response.data.user),
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}