import { useDispatch, useSelector } from "react-redux";
import { getRefSections } from "../actions/ReferenceActions";
const RefSectionsHooks = (props) => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.ReferenceReducer.sections);
  const GetReferenceSections = (id) => {
    try {
      dispatch(getRefSections(id));
    } catch (error) {
      console.error(error);
    }
  };
  const GetReferenceSectionsbyUser = () => {
    try {
      dispatch(getRefSections(props.id));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    sections,
    GetReferenceSections,
  };
};

export default RefSectionsHooks;
