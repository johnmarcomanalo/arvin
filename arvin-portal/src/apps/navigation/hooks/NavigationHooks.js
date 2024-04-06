import { useDispatch } from "react-redux";
import { NavigationContants } from "../constants/Constants";
const NavigationHooks = (props) => {
  const dispatch = useDispatch();
  const onOpenModal = () => {
    dispatch({
      type: NavigationContants.ACTION_NAVIGATION,
      payload: {
        wishlist_modal: true,
      },
    });
  };
  const onCloseModal = () => {
    dispatch({
      type: NavigationContants.ACTION_NAVIGATION,
      payload: {
        wishlist_modal: false,
      },
    });
  };
  
  return {
    onOpenModal,
    onCloseModal,
  };
};

export default NavigationHooks;
