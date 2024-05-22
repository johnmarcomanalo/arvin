import { Grid, Stack, Box, Typography, Link } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Field, change, reduxForm } from "redux-form";
import ButtonComponent from "../../../../components/button/Button";
import InputField from "../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../reducer/Contants";
import CSRFToken from "../../../../security/csrftoken";
import configure from "../../../configure/configure.json";
import { loginUser, onLogin } from "../actions/LoginActions";
import SaltMountain from "../../../../media/backgrounds/salt_mountain.jpeg";
import arvin_logo_white_font2 from "../../../../media/logo/arvin_logo_blue_font.png";
import arvin_logo_white_font from "../../../../media/logo/arvin_logo_white_font.png";
import arvin_logo_blue_font2 from "../../../../media/logo/arvin_logo_blue_font2.png";
import { decryptaes } from "../../../../utils/LightSecurity";
import swal from "sweetalert";
const formName = "Login";
const submit = async (values, dispatch, props, navigate) => {
  dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: true,
    },
  });
  const response = await dispatch(loginUser(values));
  let decrypted = decryptaes(response?.data);
  dispatch({
    type: Constants.ACTION_LOADING,
    payload: {
      loading: false,
    },
  });
  swal(decrypted.title, decrypted.message, decrypted.status);
  if (decrypted.result === true) {
    localStorage.setItem("token", decrypted?.token);
    localStorage.setItem("account_details", decrypted?.user);
    dispatch({
      type: Constants.ACTION_AUTHENTICATION,
      payload: {
        token: decrypted?.token,
        account_details: decryptaes(decrypted?.user),
      },
    });
    navigate("/");
    window.location.reload();
  }
};
let IndexLogin = (props) => {
  const navigate = useNavigate();
  const onSubmit = (values) => submit(values, props.dispatch, props, navigate);
  return (
    <React.Fragment>
      <Grid
        container
        style={{ height: "100vh", backgroundColor: configure.primary_color }} // Ensure the container takes the full viewport height
        justifyContent="center"
        alignItems="center"
      >
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
            <Grid item xs={12} md={12}>
              <form onSubmit={props.handleSubmit(onSubmit)}>
                <CSRFToken />

                <Stack
                  spacing={2}
                  sx={{
                    width: { sm: "30%", md: "40%" },
                    backgroundColor: configure.primary_bgcolor,
                    margin: "auto",
                    padding: 10,
                    borderRadius: 11,
                    boxShadow: configure.box_shadow,
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <img src={arvin_logo_white_font2} style={{}} />
                  </Box>
                  <Stack>
                    <Typography
                      align="left"
                      variant="h5"
                      style={{
                        color: configure.primary_color,
                        fontWeight: 900,
                      }}
                    >
                      SIGN IN
                    </Typography>
                  </Stack>
                  <Box sx={{ width: "100%" }}>
                    <Field
                      id="username"
                      name="username"
                      label="Username"
                      component={InputField}
                      required={true}
                      type="username"
                      alignment="left"
                    />
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <Field
                      id="password"
                      name="password"
                      label="Password"
                      component={InputField}
                      required={true}
                      type="password"
                      alignment="left"
                    />
                  </Box>
                  <Stack>
                    <Link
                      align="left"
                      variant="overline"
                      href="/"
                      sx={{ cursor: "pointer" }}
                    >
                      Forgot Password?
                    </Link>
                  </Stack>
                  <Box sx={{ width: "100%" }}>
                    <ButtonComponent
                      stx={configure.default_button}
                      iconType="login"
                      type="submit"
                      fullwidth={true}
                      children={"Login"}
                    />
                  </Box>
                </Stack>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundImage: `url(${SaltMountain})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100vh", // Ensures full height
            width: "100vw", // Ensures full width
            display: { xs: "none", sm: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={arvin_logo_blue_font2} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(IndexLogin);
export default connect((state) => {
  const token = state.AuthenticationReducer.token;
  return {
    token,
  };
}, {})(ReduxFormComponent);
