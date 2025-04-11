import { Grid } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import InputField from "components/inputFIeld/InputField";
const formName = "PersonalDetails";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let PersonalDetails = (props) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_date"
              name="sales_date"
              label="Sales Date"
              required={true}
              type="date"
              component={InputField}
              // disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_qouta"
              name="sales_daily_qouta"
              label="Daily Quota"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(PersonalDetails);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
