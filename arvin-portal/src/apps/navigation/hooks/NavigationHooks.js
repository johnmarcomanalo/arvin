import { useDispatch } from "react-redux";
import { NavigationContants } from "../constants/Constants";
import { useSelector } from "react-redux";
const NavigationHooks = (props) => {
  const dispatch = useDispatch();
  const request_modal = useSelector(
    (state) => state.NavigationReducer.request_modal
  );
  const request_type = useSelector(
    (state) => state.NavigationReducer.request_type
  );
  const onOpenRequestModal = (type) => {
    dispatch({
      type: NavigationContants.ACTION_NAVIGATION,
      payload: {
        request_modal: true,
        request_type: type,
      },
    });
  };
  const onCloseRequestModal = () => {
    dispatch({
      type: NavigationContants.ACTION_NAVIGATION,
      payload: {
        request_modal: false,
        request_type: "",
      },
    });
  };

  return {
    request_modal,
    request_type,
    onOpenRequestModal,
    onCloseRequestModal,
  };
};

export default NavigationHooks;
