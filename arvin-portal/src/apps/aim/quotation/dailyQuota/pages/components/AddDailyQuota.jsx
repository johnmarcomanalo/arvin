import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, formValueSelector, reduxForm } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputDatePicker from "../../../../../../components/inputFIeld/InputDatePicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
const formName = "AddDailyQuota";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let AddDailyQuota = (props) => {
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={6} lg={6}>
            <Grid item xs={12} md={12}>
              <Field
                name="target_date_Quota"
                label="Date"
                required={true}
                component={InputDatePicker}
                placeholder="Date"
                value={new Date()}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="company"
                name="company"
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
                id="business_unit"
                name="business_unit"
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
                id="location"
                name="location"
                label="Location"
                options={[]}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={12} md={6} lg={6}>
            <Grid item xs={12} md={12}>
              <Field
                id="target_daily_Quota"
                name="target_daily_Quota"
                label="Daily Quota"
                type="number"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="daily_out_Quota"
                name="daily_out_Quota"
                label="Daily Out"
                type="number"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_status_daily"
                name="target_status_daily"
                label="Status Daily Target"
                type="number"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="target_percent_daily"
                name="target_percent_daily"
                label="Percent Daily Target"
                type="number"
                required={true}
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
})(AddDailyQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
