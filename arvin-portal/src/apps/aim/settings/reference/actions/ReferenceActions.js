import { Constants } from "../../../../../reducer/Contants";
import { get } from "../../../../../api/api";
import {
  AuthGetReferences,
  AuthGetReferencesChild,
} from "../services/referenceServices";
import { decryptaes, encryptaes } from "../../../../../utils/LightSecurity";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
  PutDefaultServices,
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

export const getEmployeeCustomerAccessDetails =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/reference/get_employee_customer_access_list/get_employee_customer_access_details",
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

export const getRefProducts = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_products?pg=" +
        values.pg +
        "&lmt=" +
        values.lmt +
        "&srch=" +
        values.srch +
        "&tc=" +
        values.tc +
        "&brnd=" +
        values.brnd +
        "&brnch=" +
        values.brnch +
        "&grps=" +
        values.grps +
        "&u=" +
        values.u
    );
    response.then(async (res) => {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
      let decrypted = await decryptaes(res.data);
      await dispatch({
        type: Constants.ACTION_REFERENCE,
        payload: {
          productList: decrypted.dataList,
          dataListCount: decrypted.total,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReferenceRequestTypes = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_request_types?page=" +
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

export const postReferenceRequestType = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/ref_request_types",
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

export const getAllRefRequestTypes = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/ref_request_types");
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
          request_types: decrypted,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const putRefRequestTypes = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PutDefaultServices(
      "api/reference/ref_request_types/",
      formValues.code,
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

export const getReferenceUnitOfMeasurements = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_unit_of_measurement?page=" +
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

export const postReferenceUnitOfMeasurements =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/reference/ref_unit_of_measurement",
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

export const getAllRefUnitOfMeasurements = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/ref_unit_of_measurement");
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
          unit_of_measurements: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const putRefUnitOfMeasurements = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PutDefaultServices(
      "api/reference/ref_unit_of_measurement/",
      formValues.code,
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

export const getReferenceCurrencies = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_currencies?page=" +
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

export const postReferenceCurrencies = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/ref_currencies",
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

export const getAllRefCurrencies = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/ref_currencies");
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
          currencies: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const putRefCurrencies = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PutDefaultServices(
      "api/reference/ref_currencies/",
      formValues.code,
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

export const getReferenceValueAddedTax = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_value_added_tax?page=" +
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

export const postReferenceValueAddedTax = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/reference/ref_value_added_tax",
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

export const getAllRefValueAddedTax = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/ref_value_added_tax");
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
          value_added_tax: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReferenceRequestHierarchy = (values) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = GetSpecificDefaultServices(
      "api/reference/get_ref_request_hierarchy?page=" +
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

export const postReferenceRequestHierarchy =
  (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const res = await PostDefaultServices(
        "api/reference/ref_request_hierarchy",
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

export const getAllRefRequestHierarchy = () => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const response = AuthGetReferences("api/reference/ref_request_hierarchy");
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
          value_added_tax: decryptaes(res.data),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSpecificReferenceRequestHierarchy =
  (id) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = GetSpecificDefaultServices(
        "api/reference/get_specific_ref_request_hierarchy/",
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
            selected_ref: decrypted,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

export const getReferenceRequestHierarchyByRequestType =
  (id) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
      const response = AuthGetReferencesChild(
        "api/reference/ref_request_hierarchy",
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
            request_hierarchies: decrypted,
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
