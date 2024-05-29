import { Grid, Stack } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import { postSalesDailyOut } from "../../actions/SalesTrackerActions";
import SalesTrackerAddSalesHooks from "../../hooks/SalesTrackerAddSalesHooks";
const formName = "AddSales";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.sales_date).format("YYYY");
    values.subsection_code = props.account_details.subsection_code;
    values.added_by = props.account_details.code;
    values.modified_by = props.account_details.code;
    const res = await dispatch(postSalesDailyOut(values));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        status_daily_target: null,
        percentage_daily_target: null,
        year_sales_target: null,
        sales_daily_out_annual_settings_sales_code: null,
        addModal: false,
      },
    });
    await swal(res.data.title, res.data.message, res.data.status);
    reset();
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let AddSales = (props) => {
  const dispatch = useDispatch();
  const { ...salesTrackerAddSales } = SalesTrackerAddSalesHooks(props);

  props.dispatch(
    change(formName, "sales_daily_qouta", props.daily_sales_target)
  );
  props.dispatch(
    change(formName, "sales_daily_target", props.status_daily_target)
  );
  props.dispatch(
    change(
      formName,
      "daily_sales_target_percentage",
      props.percentage_daily_target
    )
  );
  // props.dispatch(
  //   change(formName, "sales_date", moment(new Date()).format("YYYY-MM-DD"))
  // );
  props.dispatch(
    change(
      formName,
      "sales_daily_out_annual_settings_sales_code",
      props.sales_daily_out_annual_settings_sales_code
    )
  );
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
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_out"
              name="sales_daily_out"
              label="Daily Out"
              type="number"
              required={true}
              component={InputField}
              onChange={(e) => {
                salesTrackerAddSales.GetStatusDailyTargetAndPercentageDailyTargetByDailyOut(
                  e.target.value,
                  props.daily_sales_target
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_target"
              name="sales_daily_target"
              label="Status Daily Target"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="daily_sales_target_percentage"
              name="daily_sales_target_percentage"
              label="Percent Daily Target"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit"
                type="submit"
                fullWidth={true}
                children={"Submit"}
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
})(AddSales);
const selector = formValueSelector(formName);
export default connect((state) => {
  const department_code = selector(state, "department_code");
  const section_code = selector(state, "section_code");
  const subsection_code = selector(state, "subsection_code");
  const sales_date = selector(state, "sales_date");
  const daily_sales_target = state.SalesDailyOutReducer.daily_sales_target;
  const status_daily_target = state.SalesDailyOutReducer.status_daily_target;
  const account_details = state.AuthenticationReducer.account_details;
  const percentage_daily_target =
    state.SalesDailyOutReducer.percentage_daily_target;
  const sales_daily_out_annual_settings_sales_code =
    state.SalesDailyOutReducer.sales_daily_out_annual_settings_sales_code;
  return {
    department_code,
    section_code,
    subsection_code,
    sales_date,
    daily_sales_target,
    status_daily_target,
    percentage_daily_target,
    sales_daily_out_annual_settings_sales_code,
    account_details,
  };
}, {})(ReduxFormComponent);
