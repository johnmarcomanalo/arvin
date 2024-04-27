import axios from "axios";
import Cookies from "js-cookie";
import configure from "../apps/configure/configure.json";
const port = configure.system.port;
const apiUrl = configure.system.apiUrl;
const apiDomain = configure.system.apiDomain;
const testApiDomain = configure.system.testApiDomain;
const devApiDomain = configure.system.devApiDomain;

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";

const activeDomain = window.location.hostname; //fetch active url
const ipAddressPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; //IP address pattern
const isIPAddress = ipAddressPattern.test(activeDomain); // Check if the hostname matches the IP address pattern
let api = ""; //api container
api = apiUrl + ":" + port; // isIPAddress is an ip address
// if (isIPAddress) {
//   api = apiUrl + ":" + port; // isIPAddress is an ip address
// } else {
// if (String(activeDomain) === "meralcoecozone.ums-ph.com") {
//   api = apiDomain; // isIPAddress is a meralcoecozone.ums-ph.com
// } else if (String(activeDomain) === "test-meralco.ums-ph.com") {
//   api = testApiDomain; // isIPAddress is a test-meralco.ums-ph.com
// } else if (String(activeDomain) === "dev-meralco.ums-ph.com") {
//   api = devApiDomain; // isIPAddress is a dev-meralco.ums-ph.com
// }
// }
axios.defaults.credentials = true;
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = window.location.protocol + "//" + api;

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  options: {
    // initialFormData: new FormData(),
    showLeafArrayIndexes: true,
    includeNullValues: false,
    mapping: function (value) {
      if (typeof value === "boolean") {
        return +value ? "1" : "0";
      }
      return value;
    },
  },
  headersFile: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
  headersLogin: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};
