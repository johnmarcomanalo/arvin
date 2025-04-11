import { Grid, Stack, Button } from "@mui/material";
import * as React from "react";
import NavigationHooks from "../../hooks/NavigationHooks";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import InputField from "components/inputFIeld/InputField";
import { required } from "../../../../utils/ErrorUtils";
import configure from "apps/configure/configure.json";
const formName = "RequestsForm";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let RequestsForm = (props) => {
  const { ...navigation_param } = NavigationHooks(props);
  var type = "";
  const inputs = null;
  switch (navigation_param.request_type) {
    case "Leave":
      type = navigation_param.request_type;
      break;
    case "Undertime":
      type = navigation_param.request_type;

      break;
    case "Overtime":
      type = navigation_param.request_type;

      break;
    case "Official Business":
      type = navigation_param.request_type;

      break;

    default:
      break;
  }
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {type === "Leave" && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Field
                    id="description"
                    name="description"
                    label="Description"
                    validate={required}
                    component={InputField}
                    required={true}
                  />
                </Grid>
              </Grid>
            )}
            {type === "Overtime" && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  2
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent={"flex-end"} item xs={12} md={12}>
            <Stack spacing={2} direction="row">
              <Button fullWidth style={configure.default_button} type="submit">
                Submit
              </Button>
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
})(RequestsForm);
// const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
