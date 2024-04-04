import { Button, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { required } from "../../../../utils/ErrorUtils";
import InputField from "../../../../components/inputFIeld/InputField";
import configure from "../../../configure/configure.json";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ResetPasswordHooks from "../hooks/ResetPasswordHooks";
import { onChangePassword } from "../actions/ResetPasswordActions";
import swal from "sweetalert";
const height = window.innerHeight;
const submit = async (values: any, dispatch: any, props: any) => {
  const res = await dispatch(onChangePassword(values));
  await swal(res.title, res.message, res.status);
  window.location.href = "/";
};
const IndexResetPassword = (props: any) => {
  const { ...param } = ResetPasswordHooks(props);
  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        width: "100%",
        height: height * 0.8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography sx={{ fontSize: 35, fontWeight: "bold" }}>
              ConEx San Luis
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography sx={{ fontSize: 25 }}>Change Password</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <Field
                    onChange={param.onChange}
                    id="password"
                    name="password"
                    label="New Password"
                    validate={required}
                    component={InputField}
                    required={true}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirmed Password"
                    validate={required}
                    component={InputField}
                    required={true}
                    type="password"
                  />
                </Grid>
                <Grid
                  container
                  justifyContent={"flex-end"}
                  item
                  xs={12}
                  md={12}
                >
                  <Button
                    type="submit"
                    style={configure.default_button}
                    variant="contained"
                  >
                    Change
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={24} md={12}>
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
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const ReduxFormComponent = reduxForm<any>({
  form: "IndexResetPassword",
  onSubmit: submit,
})(IndexResetPassword);
const selector = formValueSelector("IndexResetPassword");

export default connect((state: any) => {
  const password = selector(state, "password");
  const confirm_password = selector(state, "confirm_password");

  return { password, confirm_password };
})(ReduxFormComponent);
