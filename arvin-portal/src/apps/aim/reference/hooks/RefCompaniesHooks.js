import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefCompanies } from "../actions/ReferenceActions";
const RefCompaniesHooks = () => {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.ReferenceReducer.refresh);
  const companies = useSelector((state) => state.ReferenceReducer.companies);
  const GetReferenceCompanies = async () => {
    try {
      await dispatch(getRefCompanies());
    } catch (error) {
      await console.error(error);
    }
  };
  useEffect(() => {
    GetReferenceCompanies();
    return () => cancelRequest();
  }, [refresh]);
  return {
    companies,
  };
};

export default RefCompaniesHooks;
