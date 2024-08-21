import { Constants } from "../../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../../services/apiService";
import { decryptaes, encryptaes } from "../../../../../../utils/LightSecurity";

export const getRequestTypeRightsAccessList =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetSpecificDefaultServices(
        "api/reference/get_request_rights_access_list?pg=" +
          formValues.pg +
          "&lmt=" +
          formValues.lmt +
          "&srch=" +
          formValues.srch +
          "&fltr=" +
          formValues.fltr +
          "&uid=" +
          // encryptaes(JSON.parse(formValues.uid))
          formValues.uid
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
            reference_request_type_page_access: data.dataList,
            search_reference_request_type_page_access: data.dataList,
            dataListCount: data.total,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

export const postUserRequestAccess = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/system_settings/access_rights/request_rights_access_list",
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
