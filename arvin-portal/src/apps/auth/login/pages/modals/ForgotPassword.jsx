import { Button, Grid } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { required } from "../../../../../utils/ErrorUtils";
import InputField from "../../../../../components/inputFIeld/InputField";
import configure from "../../../../configure/configure.json";
import { forgotPassword } from "../../actions/LoginActions";
import swal from "sweetalert";
import { LoginConstants } from "../../constants/Constants";
const submit = async (values, dispatch, props) => {
  const res = await dispatch(forgotPassword(values));
  swal(res.title, res.message, res.status);
  dispatch({
    type: LoginConstants.ACTION_LOGIN_CONSTANT,
    payload: {
      openForgotPasswordModal: false,
    },
  });
};
let ForgotPassword = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Field
            id="username"
            name="username"
            label="Username"
            validate={required}
            component={InputField}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field
            id="email"
            name="email"
            label="Email use for this account"
            validate={required}
            component={InputField}
            required={true}
            type="email"
          />
        </Grid>
        <Grid container justifyContent={"flex-end"} item xs={12} md={12}>
          <Button
            type="submit"
            // onClick={onOpenSchedule}
            style={configure.default_button}
            // data-testid={props.dataTestId}
            // type="submit"
            variant="contained"
          >
            Proceed
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
const ReduxFormComponent = reduxForm<any>({
  form: "ForgotPassword",
  onSubmit: submit,
})(ForgotPassword);

export default connect((state) => {
  return {};
})(ReduxFormComponent);
