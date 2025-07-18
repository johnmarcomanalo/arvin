import React from "react";
import { useDispatch, useSelector } from "react-redux";
const AddEmployeeHooks = (props) => {
  const refresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const dispatch = useDispatch();
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const [state, setState] = React.useState({});
  const initialization = async () => {
    try {
      props.initialize({
        middle_name: "",
        position: "",
        position_level: "",
        added_by: account_details?.code,
        modified_by: account_details?.code,
      });
    } catch (error) {
      await console.error(error);
    }
  };

  React.useEffect(() => {
    initialization();
  }, [refresh]);
  return {
    state,
  };
};

export default AddEmployeeHooks;
