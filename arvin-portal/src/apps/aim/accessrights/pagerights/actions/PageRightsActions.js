import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getEmployeePageAccessList = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/system_settings/access_rights/page_rights/get_employee_page_access_list/" +
        id
    );
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      let decrypted = decryptaes(res.data);
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          reference_employee_page_access: decrypted.dataList,
          search_reference_employee_page_access: decrypted.dataList,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const postEmployeePageAccess =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/reference/system_settings/access_rights/page_rights",
        formValues
      );
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      return res;
    } catch (error) {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };
