import { Box, Grid, Link, Stack, Typography } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Field, change, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import CSRFToken from "../../../../../../security/csrftoken";
import { required } from "../../../../../../utils/ErrorUtils";
import configure from "../../../../../configure/configure.json";
import { postAccountChangePassword } from "../actions/ChangePasswordActions";
import ChangePasswordHooks from "../hooks/ChangePasswordHooks";
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

let ChangePassword = (props) => {
  const navigate = useNavigate();
  const { ...changepassword } = ChangePasswordHooks(props);
  const account_details = changepassword.account_details;
  props.dispatch(change(formName, "account_id", account_details.code));
  const onSubmit = (values) => submit(values, props.dispatch, props, navigate);
  return (
    <React.Fragment>
      <Grid
        container
        style={{ height: "100vh", backgroundColor: configure.primary_bgcolor }} // Ensure the container takes the full viewport height
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} md={6}>
          <Grid
            container
            style={{
              height: "100vh",
            }}
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 900, fontSize: { xs: 50, sm: 50, md: 80 } }}
                >
                  Change your
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: 50, sm: 50, md: 80 },
                    color: configure.primary_color,
                  }}
                >
                  &nbsp;PASSWORD
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid
            container
            style={{
              height: "100vh",
              backgroundColor: configure.primary_color,
            }}
            justifyContent="center"
            alignItems="center"
          >
            <form onSubmit={props.handleSubmit(onSubmit)}>
              <CSRFToken />
              <Stack
                spacing={2}
                sx={{
                  width: { xs: "30%", sm: "60%", md: "70%" },
                  backgroundColor: configure.primary_bgcolor,
                  margin: "auto",
                  padding: 10,
                  borderRadius: 11,
                  boxShadow: configure.box_shadow,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Field
                    id="current_password"
                    name="current_password"
                    label="Current Password"
                    validate={required}
                    component={InputField}
                    required={true}
                    type={"password"}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Field
                    id="password"
                    name="password"
                    label="Password"
                    validate={required}
                    component={InputField}
                    type={"password"}
                    required={true}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Field
                    id="password_confirmation"
                    name="password_confirmation"
                    label="Confirm Password"
                    validate={required}
                    component={InputField}
                    type={"password"}
                    required={true}
                  />
                </Box>
                <Stack>
                  <Link
                    align="left"
                    variant="overline"
                    href="/"
                    sx={{ cursor: "pointer" }}
                  ></Link>
                </Stack>
                <Box sx={{ width: "100%" }}>
                  <ButtonComponent
                    stx={configure.default_button}
                    iconType="update"
                    type="submit"
                    fullWidth={true}
                    children={"Change Password"}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Link
                    href="/"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: configure.primary_color,
                    }}
                  >
                    Let's go back home
                  </Link>
                </Box>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ChangePassword);
// const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
