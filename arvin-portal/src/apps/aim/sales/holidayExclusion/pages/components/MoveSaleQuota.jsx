import { Grid, Stack } from "@mui/material";
import swal from "sweetalert";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import configure from "../../../../../configure/configure.json";
import MoveSaleQuotaHooks from "../../hooks/MoveSaleQuotaHooks";
import { postMoveSalePerDay } from "../../../salesTracker/actions/SalesTrackerActions";
const formName = "MoveSaleQuota";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postMoveSalePerDay(values));
    swal(res.data.title, res.data.message, res.data.icon);
    reset();
  } catch (error) {
    console.log(error);
  }
};

let MoveSaleQuota = (props) => {
  const { ...moveSaleQuota } = MoveSaleQuotaHooks(props);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Field
              id="ref_product_groups_description"
              name="ref_product_groups_description"
              label="Product Group"
              required={true}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="ref_sub_sections_description"
              name="ref_sub_sections_description"
              label="Subsection"
              required={true}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="move_from_sales_daily_qouta"
              name="move_from_sales_daily_qouta"
              label="Daily Quota"
              type="number"
              required={true}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item container xs={12} md={5} spacing={1}>
            <Grid item xs={12} md={12}>
              <Field
                id="move_from_sales_date"
                name="move_from_sales_date"
                label="Sales Date"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="move_from_sales_daily_out"
                name="move_from_sales_daily_out"
                label="Daily Out"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="move_from_sales_daily_target"
                name="move_from_sales_daily_target"
                label="Status Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="move_from_daily_sales_target_percentage"
                name="move_from_daily_sales_target_percentage"
                label="Percent Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} md={7} spacing={1}>
            <Grid item xs={12} md={12}>
              <Field
                id="move_to_sales_date"
                name="move_to_sales_date"
                label="Move to Sale Date"
                type="date"
                required={true}
                component={InputField}
                onChange={(e) => {
                  let date = new Date(e.target.value);
                  if (date.getDay() === 0) {
                    swal("Warning", "Invalid date", "warning");
                  } else {
                    moveSaleQuota.onSelectDateToMove(date);
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="move_to_sales_daily_out"
                name="move_to_sales_daily_out"
                label="Move to Selected Daily Out"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="updated_sales_daily_out"
                name="updated_sales_daily_out"
                label="Updated Selected Daily Out"
                type="number"
                required={true}
                component={InputField}
                onChange={(e) => {
                  moveSaleQuota.computeStatusPercentageDailyTarget(
                    e.target.value,
                    props.move_to_sales_daily_qouta
                  );
                }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="move_to_sales_daily_target"
                name="move_to_sales_daily_target"
                label="Move to Status Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="updated_sales_daily_target"
                name="updated_sales_daily_target"
                label="Updated Status Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="move_to_daily_sales_target_percentage"
                name="move_to_daily_sales_target_percentage"
                label="Move to Percent Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Field
                id="updated_daily_sales_target_percentage"
                name="updated_daily_sales_target_percentage"
                label="Updated Percent Daily Target"
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
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
})(MoveSaleQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const move_to_sales_daily_qouta = selector(
    state,
    "move_to_sales_daily_qouta"
  );
  return { refresh, move_to_sales_daily_qouta };
}, {})(ReduxFormComponent);
