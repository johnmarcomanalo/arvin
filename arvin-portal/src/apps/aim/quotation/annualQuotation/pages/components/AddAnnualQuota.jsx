import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, formValueSelector, reduxForm } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
const formName = "AddAnnualQuota";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let AddAnnualQuota = (props) => {
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <Field
                id="company_code"
                name="company_code"
                label="Company"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="business_unit_code"
                name="business_unist_code"
                label="Business Unit"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="team_code"
                name="team_code"
                label="Team"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="section_code"
                name="section_code"
                label="Section"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="subsection_code"
                name="subsection_code"
                label="Sub-section"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                name="selectedYear"
                label="Select Year"
                required={true}
                component={InputYearPicker}
                placeholder="Select Year"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_year_Quota"
                name="target_year_Quota"
                label="Target Year Quota"
                type="number"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_month_Quota"
                name="target_month_Quota"
                label="Target Month Quota"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_day_Quota"
                name="target_day_Quota"
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
