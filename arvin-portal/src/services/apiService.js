import http from "./httpService";
import jsonToFormData from "json-form-data";
import { encryptaes } from "../utils/LightSecurity";
export function GetDefaultServices(path) {
  return http.get(path, {
    headers: http.headers,
  });
}

export function GetSpecificDefaultServices(path, id) {
  if (id == null || id == "") id = "%20";
  return http.get(path + id, {
    headers: http.headers,
  });
}

export function GetMultiSpecificDefaultServices(path, id) {
  var final_id = "";
  for (var i = 0; i < id.length; i++) {
    if (id[i] == null || id[i] == "") id[i] = "%20";
  }
  for (var i = 0; i < id.length; i++) {
    final_id += "/" + id[i];
  }

  return http.get(path + final_id, {
    headers: http.headers,
  });
}

export function PostDefaultServices(path, formValues) {
  return http.post(path, encryptaes(formValues), {
    headers: http.headers,
  });
}

export function PostDefaultWithFileServices(path, formValues) {
  return http.post(path, jsonToFormData(formValues, http.options), {
    headers: http.headersFile,
  });
}

export function PutDefaultServices(path, id, formValues) {
  return http.put(path + id, encryptaes(formValues), {
    headers: http.headers,
  });
}

export function DeleteDefaultServices(path, id) {
  return http.delete(path + id, {
    headers: http.headers,
  });
}
