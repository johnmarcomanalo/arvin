import { Grid, Stack } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputDatePicker from "../../../../../../components/inputFIeld/InputDatePicker";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import { postSalesDailyOut } from "../../actions/SalesDailyOutComponentSalesDailyOutActions";
import SalesDailyOutComponentSalesDailyOutHooks from "../../hooks/SalesDailyOutComponentSalesDailyOutHooks";
const formName = "AddSalesDailyOut";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.sales_date).format("YYYY");
    values.sales_date = moment(values.sales_date).format("YYYY-MM");
    const res = await dispatch(postSalesDailyOut(values));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
      },
    });

    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let AddSalesDailyOut = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...salesDailyOutComponentSalesDailyOut } =
    SalesDailyOutComponentSalesDailyOutHooks(props);

  props.dispatch(
    change(formName, "sales_daily_qouta", props.daily_sales_target)
  );
  props.dispatch(
    change(formName, "sales_daily_target", props.status_daily_target)
  );
  props.dispatch(
    change(
      formName,
      "daily_sales_target_percentage",
      props.percentage_daily_target
    )
  );
  props.dispatch(change(formName, "added_by", 1));
  props.dispatch(change(formName, "modified_by", 1));
  props.dispatch(
    change(
      formName,
      "sales_daily_out_annual_settings_sales_code",
      props.sales_daily_out_annual_settings_sales_code
    )
  );
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Field
              name="sales_date"
              label="Date"
              required={true}
              component={InputDatePicker}
              placeholder="Date"
              value={moment(new Date()).format("MM-DD-YYYY")}
              disabled
              disablePast={true}
              disableFuture={true}
              disableSunday={true}
            />
          </Grid>
          {/* <Grid item xs={12} md={12}>
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
                  props.change("subsection_code", "");
                  props.change("subsection", "");
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
                  refSubSections.GetReferenceSubSections(account_details.section_code);
                  props.change("section_code", newValue.code);
                  props.change("subsection_code", "");
                  props.change("subsection", "");
                  if (props.department_code == "9") {
                    salesDailyOutComponentSalesDailyOut.GetAnnualMonthlyDailyTargetSalesBySectionSubsection(
                      "section_code",
                      newValue.code,
                      moment(props.sales_date).format("YYYY")
                    );
                  }
                }
              }}
            />
          </Grid>
          {refSubSections?.subsections.length > 0 ? (
            <Grid item xs={12} md={12}>
              <Field
                id="subsection"
                name="subsection"
                label="Sub-sections"
                options={refSubSections?.subsections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    props.change("subsection_code", newValue.code);
                    salesDailyOutComponentSalesDailyOut.GetAnnualMonthlyDailyTargetSalesBySectionSubsection(
                      "subsection_code",
                      newValue.code,
                      moment(props.sales_date).format("YYYY")
                    );
                  }
                }}
              />
            </Grid>
          ) : null} */}
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_qouta"
              name="sales_daily_qouta"
              label="Daily Quota"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_out"
              name="sales_daily_out"
              label="Daily Out"
              type="number"
              required={true}
              component={InputField}
              onChange={(e) => {
                salesDailyOutComponentSalesDailyOut.GetStatusDailyTargetAndPercentageDailyTargetByDailyOut(
                  e.target.value,
                  props.daily_sales_target
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_target"
              name="sales_daily_target"
              label="Status Daily Target"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="daily_sales_target_percentage"
              name="daily_sales_target_percentage"
              label="Percent Daily Target"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
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
                children={"Submit"}
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
})(AddSalesDailyOut);
const selector = formValueSelector(formName);
export default connect((state) => {
  const department_code = selector(state, "department_code");
  const section_code = selector(state, "section_code");
  const subsection_code = selector(state, "subsection_code");
  const sales_date = selector(state, "sales_date");
  const daily_sales_target = state.SalesDailyOutReducer.daily_sales_target;
  const status_daily_target = state.SalesDailyOutReducer.status_daily_target;
  const account_details = state.AuthenticationReducer.account_details;
  const percentage_daily_target =
    state.SalesDailyOutReducer.percentage_daily_target;
  const sales_daily_out_annual_settings_sales_code =
    state.SalesDailyOutReducer.sales_daily_out_annual_settings_sales_code;
  return {
    department_code,
    section_code,
    subsection_code,
    sales_date,
    daily_sales_target,
    status_daily_target,
    percentage_daily_target,
    sales_daily_out_annual_settings_sales_code,
    account_details,
  };
}, {})(ReduxFormComponent);
