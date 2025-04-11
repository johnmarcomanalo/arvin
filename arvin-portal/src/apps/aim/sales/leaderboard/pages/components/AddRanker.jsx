import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import { Constants } from "../../../../../../reducer/Contants";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import configure from "apps/configure/configure.json";
import RefBusinessUnitsHooks from "../../../../settings/reference/hooks/RefBusinessUnitsHooks";
import RefCompaniesHooks from "../../../../settings/reference/hooks/RefCompaniesHooks";
import RefDepartmentsHooks from "../../../../settings/reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../settings/reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../settings/reference/hooks/RefSubSectionsHooks";
import RefTeamsHooks from "../../../../settings/reference/hooks/RefTeamsHooks";
import { postCreateRankerAnnualSalesRanking } from "../../actions/SalesLeaderboardActions";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../../hooks/SalesLeaderboardHooks";
const formName = "AddRanker";
const submit = async (values, dispatch, props) => {
  try {
    let value = {
      type: "subsection",
      ranker_code: values.subsection_code,
      rank_code: props.selected_code,
      added_by: values.added_by,
      modified_by: values.modified_by,
    };
    const res = await dispatch(postCreateRankerAnnualSalesRanking(value));
    let decrypted = await decryptaes(res?.data);
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal2: false,
      },
    });
    await swal(decrypted.title, decrypted.message, decrypted.status);
    await reset();
  } catch (error) {
    console.log(error);
  }
};

let AddRanker = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...salesDailyOutComponentAnnualSalesRanking } =
    SalesDailyOutComponentAnnualSalesRankingHooks(props);
  const account_details =
    salesDailyOutComponentAnnualSalesRanking.account_details;
  props.dispatch(change(formName, "added_by", account_details.code));
  props.dispatch(change(formName, "modified_by", account_details.code));
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
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
              key={props.refresh}
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
              key={props.refresh}
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
})(AddRanker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const selected_code = state.SalesDailyOutReducer.selected_code;
  return { refresh, selected_code };
}, {})(ReduxFormComponent);
