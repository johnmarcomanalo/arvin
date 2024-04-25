import { loginApi, post, postNoToken } from "../../../../api/api";
import { encryptLocal } from "../../../../utils/Encryption";
export const onLogin = (values) => async (dispatch) => {
  const username = encryptLocal(values.username);
  const password = encryptLocal(values.password);
  const res = await loginApi(
    "login/?u=" +
      username +
      "&p=" +
      password +
      "&device_id=" +
      values.device_id
  );
  return res;
};

export const forgotPassword = (values) => async (dispatch) => {
  const res = await postNoToken("forgot-password/", values);

  return res;
};
