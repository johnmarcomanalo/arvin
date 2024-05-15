import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, change, formValueSelector, reduxForm } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import { Constants } from "../../../../../../reducer/Contants";
import QuotationComponentAnnualQuotaHooks from "../../hooks/QuotationComponentAnnualQuotaHooks";
import { postAnnualQouta } from "../../actions/QuotationComponentAnnualQuotaActions";
import moment from "moment";
const formName = "AddAnnualQuota";
const submit = async (values, dispatch, props) => {
  try {
    values.target_year_quota = moment(values.target_year_quota).format("YYYY");
    const res = await dispatch(postAnnualQouta(values));
  } catch (error) {
    console.log(error);
  }
};

let AddAnnualQuota = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...quotationComponentAnnualQuota } =
    QuotationComponentAnnualQuotaHooks(props);
  const account_details = quotationComponentAnnualQuota.account_details;
  const target_annual_quota = useSelector(
    (state) => state.QuotationReducer.target_annual_quota
  );
  const target_month_quota = useSelector(
    (state) => state.QuotationReducer.target_month_quota
  );
  const target_day_quota = useSelector(
    (state) => state.QuotationReducer.target_day_quota
  );

  props.dispatch(change(formName, "target_annual_quota", target_annual_quota));
  props.dispatch(change(formName, "target_month_quota", target_month_quota));
  props.dispatch(change(formName, "target_day_quota", target_day_quota));
  props.dispatch(change(formName, "added_by", account_details?.code));
  props.dispatch(change(formName, "modified_by", account_details?.code));
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
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
                    props.change("business_unit", "");
                    props.change("business_unit_code", "");
                    props.change("team", "");
                    props.change("team_code", "");
                    props.change("department", "");
                    props.change("department_code", "");
                    props.change("section", "");
                    props.change("section_code", "");
                    props.change("subsection_code", "");
                    props.change("subsection", "");
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
                    props.change("team", "");
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
                    props.change("department", "");
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
                    props.change("section", "");
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
                    props.change("subsection", "");
                  }
                }}
              />
            </Grid>
            {refSubSections?.subsections.length > 0 ? (
              <Grid item xs={12} md={12}>
                <Field
                  id="subsection_code"
                  name="subsection_code"
                  label="Sub-section"
                  options={refSubSections?.subsections}
                  getOptionLabel={(option) =>
                    option.description ? option.description : ""
                  }
                  required={true}
                  component={ComboBox}
                />
              </Grid>
            ) : null}

            <Grid item xs={12} md={12}>
              <Field
                id="target_year_quota"
                name="target_year_quota"
                label="Select Year"
                required={true}
                component={InputYearPicker}
                placeholder="Select Year"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_annual_quota"
                name="target_annual_quota"
                label="Target Annual Quota"
                type="number"
                required={true}
                component={InputField}
                onChange={
                  quotationComponentAnnualQuota.GetMonthlyAndDailyQoutaByAnnualQouta
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_month_quota"
                name="target_month_quota"
                label="Target Month Quota"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_day_quota"
                name="target_day_quota"
                label="Target Day Quota"
                type="number"
                required={true}
                disabled
                component={InputField}
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
                children={"Add Quota"}
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
})(AddAnnualQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
