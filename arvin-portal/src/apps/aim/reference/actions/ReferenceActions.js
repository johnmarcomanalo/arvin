import { Constants } from "../../../../reducer/Contants";
import { get } from "../../../../api/api";
import {
  AuthGetReferences,
  AuthGetReferencesChild,
} from "../services/referenceServices";
import { decryptaes } from "../../../../utils/LightSecurity";
import { GetSpecificDefaultServices } from "../../../../services/apiService";
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
