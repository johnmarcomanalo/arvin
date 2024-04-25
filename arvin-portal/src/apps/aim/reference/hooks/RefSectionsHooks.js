import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefSections } from "../actions/ReferenceActions";
const RefSectionsHooks = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.ReferenceReducer.sections);
  const GetReferenceSections = (id) => {
    try {
      dispatch(getRefSections(id));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    sections,
    GetReferenceSections,
  };
};

export default RefSectionsHooks;
