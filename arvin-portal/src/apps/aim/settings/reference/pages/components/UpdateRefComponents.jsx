import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import { cancelRequest } from "../../../../../../api/api";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import { putRefTruckTypes } from "../../actions/ReferenceActions";
const formName = "UpdateRefComponents";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putRefTruckTypes(values));
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
let UpdateRefComponents = (props) => {
  const { ...param } = props;
  const account_details = param.account_details;
  const selected_ref = param.selected_ref;
  React.useEffect(() => {
    props.initialize({
      modified_by: account_details?.code,
      code: selected_ref?.code,
      description: selected_ref?.description,
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
})(UpdateRefComponents);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
