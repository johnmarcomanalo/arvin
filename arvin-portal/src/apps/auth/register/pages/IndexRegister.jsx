import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  useMediaQuery,
  FormControlLabel,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React, { useState } from "react";
import InputField from "components/inputFIeld/InputField";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { required } from "../../../../utils/ErrorUtils";
import ButtonComponent from "components/button/Button";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { onRegister } from "../actions/RegisterActions";
import IndexRegisterHooks from "../hooks/IndexRegisterHooks";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { capitalize } from "../../../../utils/HelperUtils";
import swal from "sweetalert";
import { LoginConstants } from "../../login/constants/Constants";
import classNames from "classnames";
import Modal from "components/modal/Modal";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import PasswordField from "components/inputFIeld/PasswordField";
const submit = async (values, dispatch) => {
  if (
    values.password != "" &&
    values.password != null &&
    values.confirm_password != "" &&
    values.confirm_password != null &&
    values.password === values.confirm_password
  ) {
    dispatch({
      type: LoginConstants.ACTION_LOGIN_CONSTANT,
      payload: {
        isLoading: true,
      },
    });
    const res = await dispatch(onRegister(values));
    if (res.result) {
      swal(res.title, res.message, res.status);
      dispatch(reset("Register"));
      document.getElementById("login-route")?.click();
    }
    dispatch({
      type: LoginConstants.ACTION_LOGIN_CONSTANT,
      payload: {
        isLoading: false,
      },
    });
  }
};
const IndexRegister = (props) => {
  const matches = useMediaQuery("(min-width:800px)");
  const [isAgree, setAgree] = useState(false);
  const [openTermsAndCondition, setOpenTermsAndCondition] = useState(false);

  const navigate = useNavigate();
  const { ...param } = IndexRegisterHooks(props);
  const onRouteLogin = () => {
    navigate("/login/" + param.type);
  };
  const matchInput = (input, allInputs) => {
    return input === allInputs.password ? undefined : "Passwords do not match";
  };
  return (
    <div className="background-login flex justify-content-center align-item-center">
      <Grid container spacing={1} columns={24}>
        <Grid item xs={24} md={7} />
        <Grid item xs={24} md={10}>
          <form onSubmit={isAgree ? props.handleSubmit : undefined}>
            <Card elevation={matches ? undefined : 0} className="padding-10px">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid
                    container
                    justifyContent={"center"}
                    item
                    xs={24}
                    md={24}
                  >
                    <div className="flex align-item-center flex-direction-column">
                      <Typography
                        style={{ textAlign: "center" }}
                        className={classNames(
                          "font-size-22px font-bold color-red",
                          { "font-size-28px font-bold color-red": matches }
                        )}
                      >
                        {`${capitalize(String(param.user_type))} Registration`}
                      </Typography>
                      <Typography>Create new account</Typography>
                    </div>
                  </Grid>
                  <Grid item xs={24} md={4}>
                    <Field
                      id="first_name"
                      name="first_name"
                      label="First Name"
                      validate={required}
                      component={InputField}
                      required={true}
                    />
                  </Grid>

                  <Grid item xs={24} md={4}>
                    <Field
                      id="middle_name"
                      name="middle_name"
                      label="Middle Name"
                      validate={required}
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={24} md={4}>
                    <Field
                      id="last_name"
                      name="last_name"
                      label="Last Name"
                      validate={required}
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={24} md={6}>
                    <Field
                      id="contact_no"
                      name="contact_no"
                      label="Contact No"
                      validate={required}
                      component={InputField}
                      required={true}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={24} md={6}>
                    <Field
                      id="email"
                      name="email"
                      label="Email"
                      validate={required}
                      component={InputField}
                      required={true}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="username"
                      name="username"
                      label="Username"
                      validate={required}
                      component={InputField}
                      required={true}
                      type="username"
                    />
                  </Grid>

                  <Grid item xs={24} md={7}>
                    <Grid container spacing={1}>
                      <Grid item xs={24} md={24}>
                        <Field
                          type="password"
                          onChange={param.onChange}
                          id="password"
                          name="password"
                          label="Password"
                          validate={required}
                          component={PasswordField}
                          required={true}
                        />
                      </Grid>
                      <Grid item xs={24} md={24}>
                        <Field
                          type="password"
                          //   validate={[matchInput]}
                          id="confirm_password"
                          name="confirm_password"
                          label="Confirm Password"
                          validate={required}
                          component={PasswordField}
                          required={true}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={24} md={5}>
                    <div className="width-100-percent ">
                      <Typography className="font-size-13px font-bold">
                        Password Checker
                      </Typography>
                    </div>
                    <Divider />
                    <div className="flex flex-direction-column align-item-start ">
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.minUpperCase ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Min. One uppercase
                        </Typography>
                      </div>
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.minLowerCase ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Min. One lowercase
                        </Typography>
                      </div>
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.minNumber ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Min. One number
                        </Typography>
                      </div>
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.minSymbol ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Min. One special symbol
                        </Typography>
                      </div>
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.minLength ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Eight or more Character
                        </Typography>
                      </div>
                      <div className="flex align-item-center justify-content-center gap-5px">
                        <CheckCircleIcon
                          sx={{
                            color: param.match ? "#27ae60" : "#9e9fa1",
                          }}
                          className="font-size-17px"
                        />
                        <Typography className="color-gray font-size-13px">
                          Password Match
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={24} md={24}>
                    <div>
                      <Checkbox
                        onChange={() => setAgree(!isAgree)}
                        checked={isAgree}
                      />
                      <span>
                        I agree to{" "}
                        <span
                          onClick={(e) => setOpenTermsAndCondition(true)}
                          style={{
                            color: "#f39c12",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          <u> Terms and Condition</u>
                        </span>
                      </span>
                    </div>
                  </Grid>
                  {isAgree ? (
                    <Grid item xs={24} md={24}>
                      <ButtonComponent type="submit" fullwidth={true}>
                        Register
                      </ButtonComponent>
                    </Grid>
                  ) : (
                    <Grid item xs={24} md={24}>
                      <Button
                        style={{ backgroundColor: "#7b7f7f", color: "#95a5a6" }}
                        fullWidth
                      >
                        Register
                      </Button>
                    </Grid>
                  )}

                  <Grid item xs={24} md={24}>
                    <Divider />
                  </Grid>
                  <Grid item xs={24} md={24}>
                    <div className="flex align-item-center flex-direction-column">
                      <Typography className="font-size-13px">
                        Back to{" "}
                        <span
                          id="login-route"
                          className="color-red cursor-pointer"
                          onClick={onRouteLogin}
                        >
                          Login
                        </span>
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item xs={24} md={7} />
      </Grid>
      <Modal
        open={openTermsAndCondition}
        fullScreen={matches ? false : true}
        title={"Terms and Conditions"}
        size={"md"}
        action={undefined}
        handleClose={() => setOpenTermsAndCondition(false)}
      >
        <TermsAndConditions
          onAgree={() => {
            setAgree(true);
            setOpenTermsAndCondition(false);
          }}
        />
        <PrivacyPolicy
          onAgree={() => {
            setAgree(true);
            setOpenTermsAndCondition(false);
          }}
        />
      </Modal>
    </div>
  );
};

const ReduxFormComponent =
  reduxForm <
  any >
  {
    form: "Register",
    onSubmit: submit,
  }(IndexRegister);
const selector = formValueSelector("Register");
export default connect((state) => {
  const password = selector(state, "password");
  const confirm_password = selector(state, "confirm_password");

  return { password, confirm_password };
})(ReduxFormComponent);
