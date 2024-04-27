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
import SalesDailyOutComponentAnnualSettingSaleHooks from "../../hooks/SalesDailyOutComponentAnnualSettingSaleHooks";
import { postAnnualTargetSales } from "../../actions/SalesDailyOutComponentAnnualSettingSaleActions";
import moment from "moment";
const formName = "AddAnnualQuota";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    const res = await dispatch(postAnnualTargetSales(values));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let AddAnnualSettingSale = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...salesDailyOutComponentAnnualSettingSale } =
    SalesDailyOutComponentAnnualSettingSaleHooks(props);

  const annual_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_target
  );
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  const daily_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.daily_sales_target
  );

  props.dispatch(change(formName, "annual_sales_target", annual_sales_target));
  props.dispatch(
    change(formName, "monthly_sales_target", monthly_sales_target)
  );
  props.dispatch(change(formName, "daily_sales_target", daily_sales_target));
  props.dispatch(change(formName, "added_by", 1));
  props.dispatch(change(formName, "modified_by", 1));
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
            ) : null}

            <Grid item xs={12} md={12}>
              <Field
                id="year_sales_target"
                name="year_sales_target"
                label="Select Year"
                required={true}
                component={InputYearPicker}
                placeholder="Select Year"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="annual_sales_target"
                name="annual_sales_target"
                label="Target Annual Quota"
                type="number"
                required={true}
                component={InputField}
                onChange={
                  salesDailyOutComponentAnnualSettingSale.GetMonthlyAndDailyQoutaByAnnualQouta
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="monthly_sales_target"
                name="monthly_sales_target"
                label="Target Month Quota"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="daily_sales_target"
                name="daily_sales_target"
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
})(AddAnnualSettingSale);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
