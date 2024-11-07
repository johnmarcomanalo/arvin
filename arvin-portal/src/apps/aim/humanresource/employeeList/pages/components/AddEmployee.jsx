import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import RefBusinessUnitsHooks from "../../../../settings/reference/hooks/RefBusinessUnitsHooks";
import RefCompaniesHooks from "../../../../settings/reference/hooks/RefCompaniesHooks";
import RefDepartmentsHooks from "../../../../settings/reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../settings/reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../settings/reference/hooks/RefSubSectionsHooks";
import RefTeamsHooks from "../../../../settings/reference/hooks/RefTeamsHooks";
import { postAddEmployee } from "../../actions/AddEmployeeActions";
import AddEmployeeHooks from "../../hooks/AddEmployeeHooks";
import swal from "sweetalert";

const formName = "AddEmployee";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postAddEmployee(values));
    swal(res.data.title, res.data.message, res.data.status);
    reset();
  } catch (error) {
    console.log(error);
  } finally {
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  }
};

let AddEmployee = (props) => {
  const dispatch = useDispatch();
  const matches = useMediaQuery("(min-width:600px)");
  const { ...addEmployee } = AddEmployeeHooks(props);
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const state = addEmployee?.state;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <Field
                id="first_name"
                name="first_name"
                label="First Name"
                required={true}
                component={InputField}
                multiline={true}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="last_name"
                name="last_name"
                label="Last Name"
                required={true}
                component={InputField}
                multiline={true}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Field
                id="company"
                name="company"
                label="Company"
                options={refCompanies?.companies}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    dispatch({
                      type: Constants.ACTION_REFERENCE,
                      payload: {
                        teams: [],
                        departments: [],
                        sections: [],
                        subsections: [],
                      },
                    });
                    refBusinessUnits.GetReferenceBusinessUnits(newValue.code);
                    props.change("company_code", newValue.code);
                    props.change("business_unit_code", "");
                    props.change("team_code", "");
                    props.change("department_code", "");
                    props.change("section_code", "");
                    props.change("subsection_code", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="business_unit"
                name="business_unit"
                label="Business Unit"
                options={refBusinessUnits?.business_units}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    refTeams.GetReferenceTeams(newValue.code);
                    props.change("business_unit_code", newValue.code);
                    props.change("team_code", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="team"
                name="team"
                label="Team"
                options={refTeams?.teams}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    refDepartments.GetReferenceDepartments(newValue.code);
                    props.change("team_code", newValue.code);
                    props.change("department_code", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="department"
                name="department"
                label="Department"
                options={refDepartments?.departments}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    refSections.GetReferenceSections(newValue.code);
                    props.change("department_code", newValue.code);
                    props.change("section_code", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="section"
                name="section"
                label="Section"
                options={refSections?.sections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    refSubSections.GetReferenceSubSections(newValue.code);
                    props.change("section_code", newValue.code);
                    props.change("subsection_code", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="subsection"
                name="subsection"
                label="Sub-section"
                options={refSubSections?.subsections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    props.change("subsection_code", newValue.code);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="username"
                name="username"
                label="Username"
                required={true}
                component={InputField}
                multiline={true}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit"
                type="submit"
                fullWidth={true}
                children={"Add Employee"}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(AddEmployee);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
