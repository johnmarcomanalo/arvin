import { Constants } from "../../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../../services/apiService";
import { decryptaes, encryptaes } from "../../../../../../utils/LightSecurity";

export const getEmployeeCustomerAccessList =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      let encodedQuery = encodeURIComponent(formValues.srch);
      const response = GetSpecificDefaultServices(
        "api/reference/get_employee_customer_access_list?pg=" +
          formValues.pg +
          "&lmt=" +
          formValues.lmt +
          "&srch=" +
          encodedQuery +
          "&fltr=" +
          formValues.fltr +
          "&uid=" +
          encryptaes(JSON.parse(formValues.uid))
      );
      response.then((res) => {
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
        let decrypted = decryptaes(res.data);
        let data = decrypted?.pagination;
        dispatch({
          type: Constants.ACTION_REFERENCE,
          payload: {
            dataList: data.dataList,
            reference_customer_page_access: data.dataList,
            search_reference_customer_page_access: data.dataList,
            dataListCount: data.total, 
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

export const postEmployeeCustomerAccess = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/system_settings/access_rights/customer_rights",
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
