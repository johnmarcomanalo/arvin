import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelRequest } from "../../../../../../api/api";
import { Constants } from "../../../../../../reducer/Contants";

import { decryptaes } from "../../../../../../utils/LightSecurity";
import swal from "sweetalert";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { getReferenceRequestHierarchyByRequestType } from "../../../reference/actions/ReferenceActions";
const UpdateUserRequestHierarchyHooks = (props) => {
  const dispatch = useDispatch();
  const selected_ref = useSelector(
    (state) => state.ReferenceReducer.selected_ref
  );
  const selectedDataList = useSelector(
    (state) => state.HumanResourceReducer.selectedDataList
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const request_hierarchies = useSelector(
    (state) => state.ReferenceReducer.request_hierarchies
  );
  const GetHierarchybyRequestTypeCode = async () => {
    try {
      await dispatch(
        getReferenceRequestHierarchyByRequestType(
          selected_ref.request_type_code
        )
      );
    } catch (error) {
      await console.error(error);
    }
  };
  React.useEffect(() => {
    if (selected_ref !== null) {
      GetHierarchybyRequestTypeCode();
    }
    return () => cancelRequest();
  }, []);
  React.useEffect(() => {
    props.initialize({
      request_type_description: selected_ref.request_type_description,
      access_rights: 1,
      modified_by: account_details.code,
      added_by: account_details.code,
      user_code: selectedDataList.code,
      ref_request_type_code: selected_ref.request_type_code,
    });
  }, []);

  return {
    request_hierarchies,
  };
};

export default UpdateUserRequestHierarchyHooks;
