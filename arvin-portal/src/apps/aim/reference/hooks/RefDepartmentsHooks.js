import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefDepartments } from "../actions/ReferenceActions";
const RefDepartmentsHooks = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.ReferenceReducer.departments);
  const GetReferenceDepartments = (id) => {
    try {
      dispatch(getRefDepartments(id));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    departments,
    GetReferenceDepartments,
  };
};

export default RefDepartmentsHooks;
