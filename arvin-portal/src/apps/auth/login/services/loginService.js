import { encryptaes } from "../../../../utils/LightSecurity";
import http from "../../../../services/httpService";
export function login(formValues) {
  return http.post("api/login", encryptaes(formValues), {
    headers: http.headersLogin,
  });
}

export function logout(formValues) {
  return http.post("api/logout", formValues, {
    headers: http.headers,
  });
}
