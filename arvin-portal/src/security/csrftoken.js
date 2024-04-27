import React from "react";
import Cookies from "js-cookie";
import http from "../services/httpService";

http.get("/sanctum/csrf-cookie").then(() => {});
var csrftoken = Cookies.get("XSRF-TOKEN");

const CSRFToken = () => {
  return <input type="hidden" name="_token" value={csrftoken} />;
};
export default CSRFToken;
