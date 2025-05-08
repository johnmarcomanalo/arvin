
import configure from "apps/configure/configure.json";
import { Constants } from "reducer/Contants";
import {
  GetSpecificDefaultServices,
  PostDefaultServices,
  PutDefaultServices
} from "services/apiService";
import swal from "sweetalert";
import { decryptaes } from "utils/LightSecurity";
export const getCheckDetails = (formValues) => async (dispatch) => {
    try {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: true,
        },
      });
       
        const results = await GetSpecificDefaultServices(
          "api/epaycheck/get_check_details?q=" +
            formValues.q +
            "&p=" +
            formValues.p +
            "&df=" +
            formValues.df +
            "&dt=" +
            formValues.dt +
            "&s=" +
            formValues.s +
            "&sc=" +
            formValues.sc+
            "&sort_by=" +
            formValues.sort_by +
            "&order=" +
            formValues.order
        );
  
        let decrypted = decryptaes(results?.data)
        let data  = decrypted?.dataList;
        let total = decrypted?.dataListCount;
          dispatch({
              type: Constants.ACTION_EPAY_CHECK,
              payload: {
                dataList: data, 
                dataListCount: total
              },
          });
     
    } catch (error) {
      let title = configure.error_message.default;
      let message = "";
      let status  ="error"
  
      if (error.response?.data?.message) {
        title = error.response.data.message;
      }
  
      if (error.response?.data?.status) {
        status = error.response.data.status;
      }
  
      if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).flat().join("\n");
      }
      
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: { loading: false },
      });
      
      await swal(title, message, status);
    } finally {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    } 
}


export const postCheckDetailsStatus = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/epaycheck/check_details/update_check_status",
      formValues
    );  
  
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    }); 
    
    let decrypted = decryptaes(res?.data)
    return decrypted;
  } catch (error) {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
 

export const putCheckMonitoring = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PutDefaultServices(
      "api/epaycheck/check_details/",
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
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }

    dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });

    await swal(title, message, status);
  }
};

export const postCheckDetailsReceive = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
    const res = await PostDefaultServices(
      "api/epaycheck/check_details/update_check_receive",
      formValues
    );  
  
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    }); 
    
    let decrypted = decryptaes(res?.data)
    return decrypted;
  } catch (error) {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};
 
export const getCheckForApproval = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
     
      const results = await GetSpecificDefaultServices(
        "api/epaycheck/check_approval/get_for_approval_list?q=" +
          formValues.q +
          "&p=" +
          formValues.p +
          "&s=" +
          formValues.s +
          "&sc=" +
          formValues.sc
      );

      let decrypted = decryptaes(results?.data)
      let data  = decrypted?.dataList;
      let total = decrypted?.dataListCount;
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              dataList: data, 
              dataListCount: total
            },
        });
   
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }
    
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
    
    await swal(title, message, status);
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } 
}

export const postCheckForApproval = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    const res = await PostDefaultServices(
      "api/epaycheck/check_approval/update_request_status",
      formValues
    ); 

    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });  

    let decrypted = decryptaes(res?.data) 

    return decrypted;
  } catch (error) {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};


export const getCheckApprovalDetails = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });
     
      const results = await GetSpecificDefaultServices("api/epaycheck/check_approval/" +  formValues.c  );

      let decrypted = decryptaes(results?.data)
      let data  = decrypted?.dataList;
      let total = decrypted?.dataListCount;
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              dataList2: data, 
              dataListCount2: total
            },
        });
   
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }
    
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
    
    await swal(title, message, status);
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } 
}



export const getCheckReceive = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

      const results = await GetSpecificDefaultServices(
        "api/epaycheck/get_check_receive?q=" +
          formValues.q +
          "&p=" +
          formValues.p +
          "&df=" +
          formValues.df +
          "&dt=" +
          formValues.dt +
          "&s=" +
          formValues.s +
          "&sc=" +
          formValues.sc
      );

      let decrypted = decryptaes(results?.data)
      let data  = decrypted?.dataList;
      let total = decrypted?.dataListCount;
        dispatch({
            type: Constants.ACTION_EPAY_CHECK,
            payload: {
              dataList: data, 
              dataListCount: total
            },
        });
   
  } catch (error) {
    let title = configure.error_message.default;
    let message = "";
    let status  ="error"

    if (error.response?.data?.message) {
      title = error.response.data.message;
    }

    if (error.response?.data?.status) {
      status = error.response.data.status;
    }

    if (error.response?.data?.errors) {
      message = Object.values(error.response.data.errors).flat().join("\n");
    }
    
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: { loading: false },
    });
    
    await swal(title, message, status);
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } 
}


export const postCheckRejectToClose = (formValues) => async (dispatch) => {
  try {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: true,
      },
    });

    const res = await PostDefaultServices(
      "api/epaycheck/check_details/update_reject_for_close",
      formValues
    ); 

    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });  
    
    let decrypted = decryptaes(res?.data) 

    return decrypted;
  } catch (error) {
      let title = configure.error_message.default;
      let message = "";
      let status  ="error"

      if (error.response?.data?.message) {
        title = error.response.data.message;
      }

      if (error.response?.data?.status) {
        status = error.response.data.status;
      }

      if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).flat().join("\n");
      }
      
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: { loading: false },
      }); 
      
      await swal(title, message, status);
    } finally {
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });
    } 
};