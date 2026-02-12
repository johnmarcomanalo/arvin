import axios from "axios";
import jwt from "jwt-decode";
import swal from "sweetalert";
import Cookies from "universal-cookie";
import { Constant } from "../apps/auth/login/constants/Constants";
import { CryptoJSAesDecrypt, CryptoJSAesEncrypt } from "../utils/Encryption";
import { Constants } from "../reducer/Contants";
import { decryptaes, encryptaes } from "../utils/LightSecurity";
import configure from "../apps/configure/configure.json";
const cookies = new Cookies();
let serverurl = "http://127.0.0.1:8000/api/";
let imagerurl = "http://127.0.0.1:8000/api";
const CancelToken = axios.CancelToken;
let source = CancelToken.source();
let token = "";
token = cookies.get("jwt_authorization");

let headers = {
  "Content-Type": "application/json",
  // Authorization: `Bearer ${token}`,
};
if (token) {
  headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
const form_headers = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};
const headers_no_token = {
  "Content-Type": "application/json",
};
const headersLogin = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export function cancelRequest() {
  source.cancel("Operation canceled by the user.");
  source = CancelToken.source();
}

export function loginApi(method, param2, dispatch) {
  let param = encryptaes(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(
          serverurl + method,

          { param },

          { headersLogin },
        )
        .then((res) => {
          let decrypt = CryptoJSAesDecrypt(res.data.data);
          res.data.data = decrypt;
          resolve(res.data);
        })
        .catch((error) => {
          //Handle the error request
          // const response = error.response.data;
          // if (response.title) {
          //   swal(response.title, response.message, response.status);
          // } else if (error.response.status != 403) {
          //   swal("Error", response, "error");
          // }
          // if (error.response.status == "403") {
          //   cookies.remove("jwt_authorization");
          //   swal("Error", "Token is not valid", "error").then(() => {
          //     localStorage.clear();
          //     window.location.href = "/";
          //     setTimeout(() => {
          //       window.location.reload();
          //     }, 500);
          //   });
          // }
          // dispatch({
          //   type: Constants.ACTION_LOADING,
          //   payload: {
          //     loading: false,
          //   },
          // });
          // reject(error);
          console.log(error);
        });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      reject(error);
    }
  });
}

export function fetch(method, dispatch) {
  return new Promise((resolve, reject) => {
    axios
      .get(serverurl + method, { headers })
      .then((response) => {
        let encryptedData = response.data;
        let decryptedData = CryptoJSAesDecrypt(encryptedData);
        resolve(decryptedData); // Resolve the promise with the decrypted data
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
export function get(method) {
  return new Promise((resolve, reject) => {
    axios
      .get(serverurl + method, {cancelToken: source.token, headers  })
      .then((response) => {
        let encryptedData = response.data;
        let decryptedData = CryptoJSAesDecrypt(encryptedData);
        resolve(decryptedData); // Resolve the promise with the decrypted data
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
export function register(method, param2, dispatch) {
  let param = CryptoJSAesEncrypt(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    axios
      .post(
        serverurl + method,
        {
          param,
        },
        { cancelToken: source.token, headers: headers_no_token },
      )
      .then((res) => {
        let decrypt = CryptoJSAesDecrypt(res.data.data);
        res.data.data = decrypt;

        resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        console.error("Handled error:", error);
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
        reject(error);
      });
  });
}
export function post(method, param2, dispatch) {
  let param = encryptaes(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(
          serverurl + method,
          {
            param,
          },
          { headers },
        )
        .then((res) => {
          // let decrypt = CryptoJSAesDecrypt(res.data.data);
          // res.data.data = decrypt;
          // resolve(res.data);
        })
        .catch((error) => {
          //Handle the error request
          // const response = error.response.data;
          // if (response.title) {
          //   swal(response.title, response.message, response.status);
          // } else if (error.response.status != 403) {
          //   swal("Error", response, "error");
          // }
          // if (error.response.status == "403") {
          //   cookies.remove("jwt_authorization");
          //   swal("Error", "Token is not valid", "error").then(() => {
          //     localStorage.clear();
          //     window.location.href = "/";
          //     setTimeout(() => {
          //       window.location.reload();
          //     }, 500);
          //   });
          // }
          // dispatch({
          //   type: Constants.ACTION_LOADING,
          //   payload: {
          //     loading: false,
          //   },
          // });
          // reject(error);
          console.log(error);
        });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      reject(error);
    }
  });
}

export function fileUpload(method, formData, dispatch) {
  return new Promise((resolve, reject) => {
    axios
      .post(serverurl + method, formData, {
        cancelToken: source.token,
        headers: form_headers,
      })
      .then((res) => {
        let decrypt = res.data.data;
        res.data.data = decrypt;
        resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
      });
  });
}

export function put(method, id, param2, dispatch) {
  let param = CryptoJSAesEncrypt(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    axios
      .put(serverurl + method + id, param, { headers })
      .then((res) => {
        let decrypt = CryptoJSAesDecrypt(res.data.data);
        res.data.data = decrypt;
        resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
        reject(error);
      });
  });
}

export function putNoToken(method, id, param2, dispatch) {
  let param = CryptoJSAesEncrypt(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    axios
      .put(serverurl + method + id, param, { headers: headers_no_token })
      .then((res) => {
        let decrypt = CryptoJSAesDecrypt(res.data.data);
        res.data.data = decrypt;
        resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
        dispatch({
          type: Constants.ACTION_LOADING,
          payload: {
            loading: false,
          },
        });
        reject(error);
      });
  });
}

export function remove(method, id, dispatch) {
  return new Promise((resolve, reject) => {
    axios
      .delete(serverurl + method + id)
      .then((res) => {
        let decrypt = CryptoJSAesDecrypt(res.data.data);
        res.data.data = decrypt;
        resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
        reject(error);
      });
  });
}

export function postNoToken(method, param2) {
  let param = CryptoJSAesEncrypt(JSON.stringify(param2));
  return new Promise((resolve, reject) => {
    axios
      .post(
        serverurl + method,
        {
          param,
        },
        { cancelToken: source.token, headers: headers_no_token },
      )
      .then((res) => {
        // let decrypt = CryptoJSAesDecrypt(res.data.data);
        // res.data.data = decrypt;
        // resolve(res.data);
      })
      .catch((error) => {
        //Handle the error request
        const response = error.response.data;
        if (response.title) {
          swal(response.title, response.message, response.status);
        } else if (error.response.status != 403) {
          swal("Error", response, "error");
        }
        if (error.response.status == "403") {
          cookies.remove("jwt_authorization");
          swal("Error", "Token is not valid", "error").then(() => {
            localStorage.clear();
            window.location.href = "/";
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
        reject(error);
      });
  });
}

export const imageUrl = imagerurl;
export const tokenValue = token;
