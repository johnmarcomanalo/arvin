import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export const getEmployeeList = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/humanresource/employee_list?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f +
        "&uid=" +
        values.u
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
        type: Constants.ACTION_HUMAN_RESOURCE,
        payload: {
          searchdataList: decrypted.dataList.data,
          searchdataListCount: decrypted.dataList.total,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};
