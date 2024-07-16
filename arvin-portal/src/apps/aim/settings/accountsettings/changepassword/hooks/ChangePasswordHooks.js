import { useSelector } from "react-redux";
const ChangePasswordHooks = (props) => {
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  return {
    account_details,
  };
};

export default ChangePasswordHooks;
