import { putNoToken } from "../../../../api/api";
import { LoginConstants } from "../../login/constants/Constants";

export const onChangePassword = (values) => async (dispatch) => {
  dispatch({
    type: LoginConstants.ACTION_LOGIN_CONSTANT,
    payload: {
      isLoading: true,
    },
  });
  const res = await putNoToken(
    "change-password/",
    values.id + "/",
    values,
    dispatch
  );
  // dispatch({
  //   type: LoginConstants.ACTION_LOGIN_CONSTANT,
  //   payload: {
  //     isLoading: true,
  //   },
  // });
  return res;
};
