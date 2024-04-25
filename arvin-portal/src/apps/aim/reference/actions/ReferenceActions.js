import { Constants } from "../../../../reducer/Contants";
import { get } from "../../../../api/api";
export const getRefCompanies = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await get("reference/companies");
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        companies: res,
      },
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
    const res = await get("reference/business_units/" + id);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        business_units: res,
      },
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
    const res = await get("reference/teams/" + id);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        teams: res,
      },
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
    const res = await get("reference/departments/" + id);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        departments: res,
      },
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
    const res = await get("reference/sections/" + id);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        sections: res,
      },
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
    const res = await get("reference/subsections/" + id);
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        subsections: res,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
