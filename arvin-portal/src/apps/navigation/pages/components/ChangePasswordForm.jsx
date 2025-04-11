import { Grid, Stack, Button } from "@mui/material";
import * as React from "react";
import NavigationHooks from "../../hooks/NavigationHooks";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import InputField from "components/inputFIeld/InputField";
import { required } from "../../../../utils/ErrorUtils";
import configure from "apps/configure/configure.json";
import { postAccountChangePassword } from "../../actions/NavigationActions";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
const formName = "ChangePasswordForm";
const submit = async (values, dispatch, props, navigate) => {
  try {
    const res = await dispatch(postAccountChangePassword(values));
    let decrypted = res?.data;
    await swal(decrypted.title, decrypted.message, decrypted.status);
    await reset();
    if (decrypted.result) {
      await localStorage.clear();
      await navigate("/login");
      await setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  } catch (error) {
    var title = configure.error_message.default;
    var message = "";

    if (error.response && error.response.data) {
      title = error.response.data.message || title;

      if (error.response.data.errors) {
        const formattedErrors = Object.entries(error.response.data.errors)
          .map(([key, value]) => `${value.join(", ")}`)
          .join("\n");
        message = formattedErrors;
      }
    }

    await swal(title, message, "warning");
  }
};

let ChangePasswordForm = (props) => {
  const navigate = useNavigate();
  const { ...navigation_param } = NavigationHooks(props);
  const account_details = navigation_param.account_details;
  props.dispatch(change(formName, "account_id", account_details.code));
  const onSubmit = (values) => submit(values, props.dispatch, props, navigate);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Field
                  id="current_password"
                  name="current_password"
                  label="Current Password"
                  validate={required}
                  component={InputField}
                  required={true}
                  type={"password"}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Field
                  id="password"
                  name="password"
                  label="Password"
                  validate={required}
                  component={InputField}
                  type={"password"}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Field
                  id="password_confirmation"
                  name="password_confirmation"
                  label="Confirm Password"
                  validate={required}
                  component={InputField}
                  type={"password"}
                  required={true}
                />
              </Grid>
            </Grid>
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
})(ChangePasswordForm);
// const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
