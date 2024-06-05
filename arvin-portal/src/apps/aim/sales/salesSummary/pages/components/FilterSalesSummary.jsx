import { Grid, Stack } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import { postAnnualTargetSales } from "../../actions/SalesSummaryActions";
import SalesSummaryHooks from "../../hooks/SalesSummaryHooks";
import { cancelRequest } from "../../../../../../api/api";
// import InputDateRange from "../../../../../../components/inputFIeld/InputDateRange";
const formName = "FilterSalesSummary";
const submit = async (values, dispatch, props) => {
  try {
    // values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    // const res = await dispatch(postAnnualTargetSales(values));
    // swal(res.data.title, res.data.message, res.data.status);
    // reset();
    // await dispatch({
    //   type: Constants.ACTION_SALES_DAILY_OUT,
    //   payload: {
    //     refresh: !props.refresh,
    //     addModal: false,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};

let FilterSalesSummary = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...salesSummary } = SalesSummaryHooks(props);

  const annual_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_target
  );
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  const daily_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.daily_sales_target
  );
  const account_details = salesSummary.account_details;
  props.dispatch(
    change(formName, "company", "Arvin Internation Marketing Inc.")
  );
  props.dispatch(change(formName, "company_code", "1"));
  props.dispatch(
    change(formName, "business_unit", "Arvin Internation Marketing Inc. - Main")
  );
  props.dispatch(change(formName, "business_unit_code", "1"));
  props.dispatch(change(formName, "annual_sales_target", annual_sales_target));
  props.dispatch(
    change(formName, "monthly_sales_target", monthly_sales_target)
  );
  props.dispatch(change(formName, "daily_sales_target", daily_sales_target));
  props.dispatch(change(formName, "added_by", account_details.code));
  props.dispatch(change(formName, "modified_by", account_details.code));
  React.useEffect(() => {
    refBusinessUnits.GetReferenceBusinessUnits(1);
    refTeams.GetReferenceTeams(1);
    refDepartments.GetReferenceDepartments(2);
    return () => cancelRequest();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            {/* <Grid item xs={12} md={12}>
              <Field
                id="date_range"
                name="date_range"
                label="Date Range"
                required={true}
                component={InputDateRange}
                placeholder="Month"
                disabled
                disablePast={false}
                disableFuture={true}
                disableSunday={true}
                showText={true}
              />
            </Grid> */}
            <Grid item xs={12} md={12}>
              <Field
                id="company"
                name="company"
                label="Company"
                disabled={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="business_unit"
                name="business_unit"
                label="Business Unit"
                disabled={true}
                component={InputField}
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
                iconType="submit1"
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
})(FilterSalesSummary);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
