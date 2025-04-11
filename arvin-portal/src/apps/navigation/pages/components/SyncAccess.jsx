import { Button, Grid } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import ButtonComponent from "components/button/Button";
import configure from "apps/configure/configure.json";
import { syncAccessbyUser } from "../../actions/SyncAccessActions";
import SyncAccessHooks from "../../hooks/SyncAccessHooks";
import { decryptaes } from "../../../../utils/LightSecurity";
import { Constants } from "../../../../reducer/Contants";
import SyncIcon from "@mui/icons-material/Sync";
import swal from "sweetalert";
const formName = "SyncAccess";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(syncAccessbyUser(values));
    let decrypted = await decryptaes(res?.data);
    if (decrypted.result === true) {
      localStorage.setItem("access", decrypted?.access);
      localStorage.setItem("account_details", decrypted?.user);
      dispatch({
        type: Constants.ACTION_AUTHENTICATION,
        payload: {
          account_details: decryptaes(decrypted?.user),
          access: decryptaes(decrypted?.access),
        },
      });
      dispatch({
        type: Constants.ACTION_NAVIGATION,
        payload: {
          sync_access_modal: false,
        },
      });
      await swal(decrypted.title, decrypted.message, decrypted.status);
    }
  } catch (error) {
    console.log(error);
  }
};

let SyncAccess = (props) => {
  const { ...syncaccess } = SyncAccessHooks(props);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid container justifyContent={"flex-end"} item xs={12} md={12}>
            <Button
              type="submit"
              fullWidth
              sx={configure.default_button}
              startIcon={<SyncIcon />}
            >
              Sync
            </Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(SyncAccess);
// const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
