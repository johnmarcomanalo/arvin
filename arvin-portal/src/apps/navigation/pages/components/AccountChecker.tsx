import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import InputField from "../../../../../components/inputFIeld/InputField";
import { required } from "../../../../../utils/ErrorUtils";
import configure from "../../../../configure/configure.json";
import { ServiceClientJobOrderContants } from "../../../clientJobOrders/constants/Constants";
import { getMyServices } from "../../../clientJobOrders/actions/ClientJobOrderActions";
import { NavigationContants } from "../../constants/Constants";
import { onSubmitSyncVoucher } from "../../actions/NavigationActions";
import swal from "sweetalert";
import { HomeServicesContants } from "../../../home/constants/Constants";
const formName = "AccountCheck";
const submit = async (values: any, dispatch: any, props: any) => {
  try {
    const res = await dispatch(onSubmitSyncVoucher(values));
    if (res.result) {
      await swal(res.title, res.message, res.status);
      await dispatch({
        type: NavigationContants.ACTION_NAVIGATION,
        payload: {
          account_checker_modal: false,
        },
      });
      await dispatch({
        type: HomeServicesContants.ACTION_HOME_SERVICES,
        payload: {
          refresh: !props.refresh,
        },
      });
    } else {
      swal(res.title, res.message, res.status);
    }
  } catch (error) {
    console.log(error);
    dispatch(reset(formName));
  }
};

let AccountCheck = (props: any) => {
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Typography>
              Note: Input your service provider account information to sync the
              vouchers.
            </Typography>
          </Grid>
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
              id="password"
              name="password"
              label="Password"
              type="password"
              validate={required}
              component={InputField}
              required={true}
            />
          </Grid>

          <Grid container justifyContent={"flex-end"} item xs={12} md={12}>
            <Stack spacing={2} direction="row">
              <Button fullWidth style={configure.default_button} type="submit">
                Sync
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm<any>({
  form: "AccountCheck",
  onSubmit: submit,
})(AccountCheck);
const selector = formValueSelector(formName);
export default connect((state: any) => {
  const refresh = state.ServiceReducer.refresh;
  return {
    refresh,
  };
}, {})(ReduxFormComponent);
