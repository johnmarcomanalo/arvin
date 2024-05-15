import { Constants } from "./Contants";
const initialState = {
  refresh: false,
  companies: [],
  business_units: [],
  teams: [],
  departments: [],
  sections: [],
  subsections: [],
  selected_subsection: [],
  sales_ranking: [],
  sales_ranking_placements: [],
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_REFERENCE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
