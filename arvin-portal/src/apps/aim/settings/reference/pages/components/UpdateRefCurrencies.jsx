import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import configure from "apps/configure/configure.json";
import InputField from "components/inputFIeld/InputField";
import ButtonComponent from "components/button/Button";
import { cancelRequest } from "../../../../../../api/api";
import { putRefCurrencies } from "../../actions/ReferenceActions";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
const formName = "UpdateRefCurrencies";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putRefCurrencies(values));
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        refresh: !props.refresh,
        updateModal: false,
      },
    });
    swal(res.data.title, res.data.message, res.data.icon);
  } catch (error) {
    console.log(error);
  }
};
let UpdateRefCurrencies = (props) => {
  const { ...param } = props;
  const account_details = param.account_details;
  const selected_ref = param.selected_ref;
  React.useEffect(() => {
    props.initialize({
      modified_by: account_details?.code,
      code: selected_ref?.code,
      description: selected_ref?.description,
      type: selected_ref?.type,
    });
    return () => cancelRequest();
  }, []);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="description"
              name="description"
              label="Description"
              component={InputField}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="type"
              name="type"
              label="Unit"
              component={InputField}
              required={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="update"
                type="submit"
                fullWidth={true}
                children={"Update"}
              />
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
})(UpdateRefCurrencies);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
