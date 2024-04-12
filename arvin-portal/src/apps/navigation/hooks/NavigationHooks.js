import { useDispatch } from "react-redux";
import { Constants } from "../../../reducer/Contants";
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
      type: Constants.ACTION_NAVIGATION,
      payload: {
        request_modal: true,
        request_type: type,
      },
    });
  };
  const onCloseRequestModal = () => {
    dispatch({
      type: Constants.ACTION_NAVIGATION,
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
