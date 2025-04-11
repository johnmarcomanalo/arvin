import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import configure from "apps/configure/configure.json";
// import InputDateRange from "components/inputFIeld/InputDateRange";
const formName = "FilterClientSalesTracker";
const submit = async (values, dispatch, props) => {
  try {
    // values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    // const res = await dispatch(postAnnualTargetSales(values));
    // swal(res.data.title, res.data.message, res.data.status);
    // reset();
    // await dispatch({
    //   type: Constants.ACTION_SALES_DAILY_OUT,
    //   payload: {
    //     refresh: !props.refresh,
    //     addModal: false,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};

let FilterClientSalesTracker = (props) => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={12}>
            <Field
              id="company"
              name="company"
              label="Company"
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              name="sales_date"
              label="Date"
              required={true}
              component={InputMonthYearPicker}
              placeholder="Date"
              value={moment(new Date()).format("MM-DD-YYYY")}
              disabled
              disablePast={false}
              disableFuture={true}
              disableSunday={true}
              showText={true}
              onChange={(date) => {
                salesTracker.filterMonthAndYear(date);
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit1"
                type="submit"
                fullWidth={true}
                children={"Add Quota"}
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
})(FilterClientSalesTracker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
