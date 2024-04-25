import { Grid } from "@mui/material";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../components/button/Button";
import InputField from "../../../../components/inputFIeld/InputField";
import PasswordField from "../../../../components/inputFIeld/PasswordField";
import { required } from "../../../../utils/ErrorUtils";
import configure from "../../../configure/configure.json";
import { useLocation, useNavigate } from "react-router-dom";
import { Constants } from "../../../../reducer/Contants";
import { onLogin } from "../actions/LoginActions";
const formName = "Login";
const submit = async (values, dispatch, props, navigate) => {
  dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: true,
    },
  });
  values["device_id"] = props.token;
  const response = await dispatch(onLogin(values));

  dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: false,
    },
  });
};
let IndexLogin = (props) => {
  const navigate = useNavigate();
  const onSubmit = (values) => submit(values, props.dispatch, props, navigate);
  return (
    <form onSubmit={props.handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Field
            id="username"
            name="username"
            label="Username"
            component={InputField}
            required={true}
            type="username"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field
            id="password"
            name="password"
            label="Password"
            component={InputField}
            required={true}
            type="password"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <ButtonComponent
            stx={configure.default_button}
            iconType="login"
            type="submit"
            fullWidth={true}
            children={"Login"}
          />
        </Grid>
      </Grid>
    </form>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: "",
})(IndexLogin);
export default connect((state) => {
  const token = state.AuthenticationReducer.token;
  return {
    token,
  };
}, {})(ReduxFormComponent);
