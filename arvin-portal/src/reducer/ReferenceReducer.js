import { Constants } from "./Contants";
import phbanks from "apps/configure/phbanks.json";
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
  reference_customer_page_access: [],
  search_reference_customer_page_access: [],
  reference_request_type_page_access: [],
  search_reference_request_type_page_access: [],
  modules: [],
  components: [],
  sub_components: [],
  dataList: [],
  dataListCount: 0,
  productList: [],
  selected_productList: [{ index: 1 }],
  request_types: [],
  unit_of_measurements: [],
  currencies: [],
  value_added_tax: [],
  updateModal: false,
  selected_ref: [],
  viewSelectedRefModal: false,
  request_hierarchies: [],
  salutations: [],
  printModal: false,
  product_group_category: [],
  product_group_category_sap: [],
  reference_employee_product_group_access: [],
  search_reference_employee_product_group_access: [],
  product_group_unit_of_measure: null,
  product_group_unit_of_measure_type: null,
  holidays: [],
  viewModal: false,
  viewModal2: false,
  bank_accounts: [],
  phbanks:phbanks,
  client_groups: [],
  client_groups_count: 0,
  client_sub_groups: [],
  client_sub_groups_count: 0,
  selectedDataList: [],
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
          files.module_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.component_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
          files.sub_component_description
            .toLowerCase()
            .indexOf(action.data.toLocaleLowerCase()) !== -1
        );
      });
      return {
        ...state,
        search_reference_employee_page_access: search_page,
      };

    case "search_reference_request_type_page_access":
      let search_request_type = state.reference_request_type_page_access.filter(
        (files) => {
          return (
            files.module_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.component_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.sub_component_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1
          );
        }
      );
      return {
        ...state,
        search_reference_request_type_page_access: search_request_type,
      };

    case "search_reference_employee_product_group_access":
      let search_product_group_type =
        state.reference_employee_product_group_access.filter((files) => {
          return (
            files.module_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.component_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1 ||
            files.sub_component_description
              .toLowerCase()
              .indexOf(action.data.toLocaleLowerCase()) !== -1
          );
        });
      return {
        ...state,
        search_reference_employee_product_group_access:
          search_product_group_type,
      };

    default:
      return state;
  }
};
export default dataReducer;
