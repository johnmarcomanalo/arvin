import React from "react";
import { useDispatch, useSelector } from "react-redux";
const UploadEmployeeHooks = (props) => {
  const refresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const [state, setState] = React.useState({
    attachedFile: [],
  });
  const initialization = async () => {
    try {
      props.initialize({
        record: state?.attachedFile,
        added_by: account_details?.code,
        modified_by: account_details?.code,
      });
    } catch (error) {
      await console.error(error);
    }
  };
  const handleOnDrop = (newAttachedFile, onChange) => {
    const attachedFile = newAttachedFile;
    setState(
      (prev) => ({
        ...prev,
        record: attachedFile,
      }),
      () => onChange(attachedFile)
    );
  };

  React.useEffect(() => {
    initialization();
  }, [refresh]);
  return {
    state,
    handleOnDrop,
  };
};

export default UploadEmployeeHooks;
