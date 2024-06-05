import { useDispatch, useSelector } from "react-redux";
const HomeComponentInformationHooks = (props) => {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.HomeReducer.refresh);
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  return {
    refresh,
    account_details,
  };
};

export default HomeComponentInformationHooks;
