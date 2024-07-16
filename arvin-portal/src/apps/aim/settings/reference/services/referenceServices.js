import http from "../../../../../services/httpService";
export function GetReferences(path) {
  return http.get(path, {
    headers: http.headersLogin,
  });
}

export function GetReferencesChild(path, id) {
  if (id == null || id == "") id = "%20";
  return http.get(path + "/" + id, {
    headers: http.headersLogin,
  });
}

export function AuthGetReferences(path) {
  return http.get(path, {
    headers: http.headers,
  });
}

export function AuthGetReferencesChild(path, id) {
  if (id == null || id == "") id = "%20";
  return http.get(path + "/" + id, {
    headers: http.headers,
  });
}

export function PostReferenceService(path, formValues) {
  return http.post(path, formValues, {
    headers: http.headers,
  });
}

export function UpdateReferenceService(path, id, formValues) {
  return http.put(path + id, formValues, {
    headers: http.headers,
  });
}

export function DeleteReferenceService(path, id) {
  return http.delete(path + "/" + id, {
    headers: http.headers,
  });
}

export function SearchReferenceService(path, search) {
  return http.get(path, search, {
    headers: http.headers,
  });
}
