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
  reference_employee_organization_access: [],
  search_reference_employee_organization_access: [],
  reference_employee_page_access: [],
  search_reference_employee_page_access: [],
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.ACTION_REFERENCE:
      return {
        ...state,
        ...action.payload,
      };
    case "search_reference_employee_organization_access":
      let search_org = state.reference_employee_organization_access.filter(
        (files) => {
          return (
            files.company_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.business_unit_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.team_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.department_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.section_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.subsection_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1
          );
        }
      );
      return {
        ...state,
        search_reference_employee_organization_access: search_org,
      };

    case "search_reference_employee_page_access":
      let search_page = state.reference_employee_page_access.filter((files) => {
        return (
          files.company_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.business_unit_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.team_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.department_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.section_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.subsection_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1
        );
      });
      return {
        ...state,
        search_reference_employee_page_access: search_page,
      };

    default:
      return state;
  }
};
export default dataReducer;
