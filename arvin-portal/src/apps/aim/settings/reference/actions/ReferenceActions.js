import { Constants } from "../../../../../reducer/Contants";
import { get } from "../../../../../api/api";
import {
  AuthGetReferences,
  AuthGetReferencesChild,
} from "../services/referenceServices";
import { decryptaes } from "../../../../../utils/LightSecurity";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
export const getRefCompanies = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/companies");
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          companies: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefBusinessUnits = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferencesChild("api/reference/business_units", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          business_units: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefTeams = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferencesChild("api/reference/teams", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          teams: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefDepartments = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferencesChild("api/reference/departments", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          departments: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefSections = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferencesChild("api/reference/sections", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          sections: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefSubSections = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferencesChild("api/reference/subsections", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          subsections: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSpecificRefSubSection = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/subsections/get_subsection/",
      id
    );
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          selected_subsection: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRefSalesRanking = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences(
      "api/reference/sales_ranking/get_ref_sales_ranking"
    );
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          sales_ranking: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReferenceModule = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/ref_modules?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f
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
          dataList: decrypted.dataList.data,
          dataListCount: decrypted.dataList.total,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const postReferenceModule = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices("api/reference/modules", formValues);
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

export const getAllRefModules = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/modules");
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          modules: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const postReferenceComponent = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/components",
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

export const getReferenceComponents = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/ref_components?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f
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
          dataList: decrypted.dataList.data,
          dataListCount: decrypted.dataList.total,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllRefComponents = (id) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    const response = AuthGetReferencesChild("api/reference/components", id);
    response.then((res) => {
      dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          components: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReferenceSubcomponents = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/ref_subcomponents?page=" +
        values.p +
        "&limit=" +
        values.l +
        "&q=" +
        values.q +
        "&f=" +
        values.f
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
          dataList: decrypted.dataList.data,
          dataListCount: decrypted.dataList.total,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const postReferenceSubcomponent = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/subcomponents",
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
