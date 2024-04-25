import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefSubSections } from "../actions/ReferenceActions";
const RefSubSectionsHooks = () => {
  const dispatch = useDispatch();
  const subsections = useSelector(
    (state) => state.ReferenceReducer.subsections
  );
  const GetReferenceSubSections = (id) => {
    try {
      dispatch(getRefSubSections(id));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    subsections,
    GetReferenceSubSections,
  };
};

export default RefSubSectionsHooks;
