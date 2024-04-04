import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import classNames from "classnames";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import ButtonComponent from "../../../../components/button/Button";
import InputField from "../../../../components/inputFIeld/InputField";
import Modal from "../../../../components/modal/Modal";
import { required } from "../../../../utils/ErrorUtils";
import { onLogin } from "../actions/LoginActions";
import { LoginConstants } from "../constants/Constants";
import IndexLoginHooks, {
  onLoginDetailToLoginReducer,
} from "../hooks/IndexLoginHooks";
import ForgotPassword from "./modals/ForgotPassword";
import PasswordField from "../../../../components/inputFIeld/PasswordField";

const submit = async (
  values,
  dispatch,
  props,
  navigate
) => {
  dispatch({
    type: LoginConstants.ACTION_LOGIN_CONSTANT,
    payload: {
      isLoading: true,
    },
  });
  values["device_id"] = props.device_id;
  const response = await dispatch(onLogin(values));
  localStorage.setItem("userData", JSON.stringify(response));
  await dispatch({
    type: LoginConstants.ACTION_LOGIN_CONSTANT,
    payload: { user: response },
  });
  // window.location.href = "/";

  dispatch({
    type: LoginConstants.ACTION_LOGIN_CONSTANT,
    payload: {
      isLoading: false,
    },
  });
  navigate("/");
  window.location.reload();
  // await dispatch(onLoginDetailToLoginReducer(response));
};
const IndexLogin = (props) => {
  const matches = useMediaQuery("(min-width:800px)");
  const { ...param } = IndexLoginHooks(props);
  const navigate = useNavigate();
  const location = useLocation();
  const onRouteRegister = () => {
    navigate("/register/" + param.type);
  };
  const onSubmit = (values) =>
    submit(values, props.dispatch, props, navigate);
  return (
    <div
      style={{ height: "100vh" }}
      className="background-login flex justify-content-center align-item-center"
    >
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} />
          <Grid item xs={12} md={4}>
            <Card elevation={matches ? undefined : 0} className="padding-10px">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid
                    container
                    justifyContent={"center"}
                    item
                    xs={12}
                    md={12}
                  >
                    <div className="flex align-item-center flex-direction-column">
                      <Typography
                        style={{ textAlign: "center" }}
                        className={classNames(
                          "font-size-22px font-bold color-red",
                          { "font-size-28px font-bold color-red": matches }
                        )}
                      >
                        {`${param.user_type} Login`}
                      </Typography>
                      <Typography>Sign in to your account</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="username"
                      name="username"
                      label="Username / Email"
                      validate={required}
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
                      validate={required}
                      component={PasswordField}
                      required={true}
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <ButtonComponent fullwidth={true}> Login</ButtonComponent>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Typography className="font-size-13px">
                        <span
                          onClick={param.onOpenForgotPasswordModal}
                          className="color-red cursor-pointer"
                        >
                          Forgot Password
                        </span>
                      </Typography>
                      {location.pathname === "/login/service_provider" ? (
                        <Typography className="font-size-13px">
                          <span
                            style={{ fontWeight: "bold" }}
                            onClick={() => {
                              localStorage.clear();
                              window.location.href = "#/login/service_client";
                              setTimeout(() => {
                                window.location.reload();
                              }, 500);
                            }}
                            className="color-red cursor-pointer"
                          >
                            Log In as Client
                          </span>
                        </Typography>
                      ) : (
                        <Typography className="font-size-13px">
                          <span
                            style={{ fontWeight: "bold" }}
                            onClick={() => {
                              window.location.href = "#/login/service_provider";
                              localStorage.clear();
                              setTimeout(() => {
                                window.location.reload();
                              }, 500);
                            }}
                            className="color-red cursor-pointer"
                          >
                            Log In as Provider
                          </span>
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="outlined"
                      onClick={onRouteRegister}
                      className="gradient-button-register"
                      fullWidth
                      // data-testid={props.dataTestId}
                      type="submit"
                    >
                      Register
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <div className="flex align-item-center flex-direction-column">
                      <Typography className="font-size-13px">
                        Back to{" "}
                        <span
                          onClick={() => navigate("/")}
                          className="color-red cursor-pointer"
                        >
                          Home Page
                        </span>
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} />
        </Grid>
      </form>
      <Modal
        open={param.openForgotPasswordModal}
        fullScreen={matches ? false : true}
        title={"Forgot Password"}
        size={"xs"}
        action={undefined}
        handleClose={param.onCloseForgotPasswordModal}
      >
        <ForgotPassword />
      </Modal>
    </div>
  );
};

const ReduxFormComponent = reduxForm<any>({
  form: "Login",
  // onSubmit: submit,
})(IndexLogin);
export default connect((state) => {
  const device_id = state.LoginReducer.tokenValue;
  return { device_id };
})(ReduxFormComponent);
