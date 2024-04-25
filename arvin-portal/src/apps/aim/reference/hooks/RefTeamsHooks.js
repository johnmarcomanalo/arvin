import { useDispatch, useSelector } from "react-redux";
import { React, useEffect } from "react";
import { Constants } from "../../../../reducer/Contants";
import { cancelRequest } from "../../../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { encryptLocal, decryptLocal } from "../../../../utils/Encryption";
import { useDebounce } from "../../../../utils/HelperUtils";
import { getRefTeams } from "../actions/ReferenceActions";
const RefTeamsHooks = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.ReferenceReducer.teams);
  const GetReferenceTeams = (id) => {
    try {
      dispatch(getRefTeams(id));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    teams,
    GetReferenceTeams,
  };
};

export default RefTeamsHooks;
