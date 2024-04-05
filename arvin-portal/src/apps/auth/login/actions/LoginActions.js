import { loginApi, post, postNoToken } from "../../../../api/api";
import { encryptLocal } from "../../../../utils/Encryption";
export const onLogin = (value) => async (dispatch) => {
  const username = encryptLocal(values.username);
  const password = encryptLocal(values.password);
  const userType = encryptLocal(values.user_type);
  const res = await loginApi(
    "login/?u=" +
      username +
      "&p=" +
      password +
      "&uType=" +
      userType +
      "&device_id=" +
      values.device_id,
    dispatch
  );
  return res;
};

export const forgotPassword = (values) => async (dispatch) => {
  const res = await postNoToken("forgot-password/", values);

  return res;
};
