import swal from "sweetalert";
import { post, register } from "../../../../api/api";
export const onRegister = (values) => async (dispatch) => {
  let data = values;
  data["profile"] = {
    middle_name: values.middle_name,
    contact_no: values.contact_no,
    user_type: values.user_type,
  };
  const res = await register("register/", data, dispatch);
  return res;
};
