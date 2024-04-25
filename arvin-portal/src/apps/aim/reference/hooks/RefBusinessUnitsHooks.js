import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefBusinessUnits } from "../actions/ReferenceActions";
const RefBusinessUnitsHooks = () => {
  const dispatch = useDispatch();
  const business_units = useSelector(
    (state) => state.ReferenceReducer.business_units
  );
  const GetReferenceBusinessUnits = (id) => {
    try {
      dispatch(getRefBusinessUnits(id));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    business_units,
    GetReferenceBusinessUnits,
  };
};

export default RefBusinessUnitsHooks;
