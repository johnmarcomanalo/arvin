import { ReferenceTypes } from "../apps/reference/constants/Constants";

const initialState = {
  refRegions: [],
  refProvinces: [],
  refCityMunicipalities: [],
  refBarangays: [],
  refBusinessTypes: [],
  refCategoryTypes: [],
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReferenceTypes.LIST_OF_REGION:
      return {
        ...state,
        ...action.payload,
      };
    case ReferenceTypes.LIST_OF_PROVINCE:
      return {
        ...state,
        ...action.payload,
      };
    case ReferenceTypes.LIST_OF_CITY_MUNICIPALITY:
      return {
        ...state,
        ...action.payload,
      };
    case ReferenceTypes.LIST_OF_BARANGAY:
      return {
        ...state,
        ...action.payload,
      };
    case ReferenceTypes.LIST_OF_BUSINESS_TYPES:
      return {
        ...state,
        ...action.payload,
      };
    case ReferenceTypes.LIST_OF_CATEGORY_TYPES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
