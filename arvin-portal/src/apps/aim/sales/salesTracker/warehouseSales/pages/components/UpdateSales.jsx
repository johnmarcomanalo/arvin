import { Grid, Stack } from "@mui/material";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Constants } from "reducer/Contants";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import { decryptaes } from "utils/LightSecurity";
import { putWarehouseSalesTracker } from "../../actions/WarehouseSalesActions";
import UpdateWarehouseSalesHooks from "../../hooks/UpdateWarehouseSalesHooks";
import ComboBox from "components/autoComplete/AutoComplete";
const formName = "UpdateSales";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putWarehouseSalesTracker(values));
    let decrypted = decryptaes(res?.data);
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        updateModal: false,
      },
    });
    await swal(decrypted.title, decrypted.message, decrypted.status);
    await reset();
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let UpdateSales = (props) => {
  const dispatch = useDispatch();
  const { ...salesTrackerUpdateSales } = UpdateWarehouseSalesHooks(props);
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
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_qouta"
              name="sales_daily_qouta"
              label="Daily Quota"
              //   type="number"
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
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="sales_daily_target"
              name="sales_daily_target"
              label="Sales Daily Target"
              //   type="number"
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
        </Grid>
        <Grid item xs={12} md={12}>
          <Field
            id="transfer_type"
            name="transfer_type"
            label="Transfer Type"
            options={salesTrackerUpdateSales?.transferType}
            getOptionLabel={(option) => option?.description}
            component={ComboBox}
            onChangeHandle={(e, newValue) => {
              if (newValue?.description) {
                salesTrackerUpdateSales.onChangeFilterTransferType(
                  newValue?.description
                );
              }
            }}
          />
        </Grid>
        {(props.transfer_type === "ADDITIONAL/SUBTRACT" ||
          props.transfer_type === "TRANSFER") && (
          <Grid item xs={12} md={12}>
            <Field
              id="transfer"
              name="transfer"
              label="Transfer"
              type="number"
              required={true}
              component={InputField}
              onChange={(e) => {
                salesTrackerUpdateSales.onChangeTransfer(
                  e.target.value,
                  props.sales_daily_out
                );
              }}
            />
          </Grid>
        )}
        {props.transfer_type !== "" && props.transfer_type !== "HOLIDAY" && (
          <Grid item xs={12} md={12}>
            <Field
              id="new_sales_daily_out"
              name="new_sales_daily_out"
              label="New Daily Out"
              type="number"
              required={true}
              component={InputField}
              disabled={props.transfer_type === "CHANGE" ? false : true}
              onChange={(e) => {
                salesTrackerUpdateSales.computeDailyTargetPercentage(
                  e.target.value,
                  props.sales_daily_qouta
                );
              }}
            />
          </Grid>
        )}
        {props.transfer_type !== "" && props.transfer_type !== "HOLIDAY" && (
          <Grid item xs={12} md={12}>
            <Field
              id="new_sales_daily_target"
              name="new_sales_daily_target"
              label="New Sales Daily Target"
              //   type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
        )}
        {props.transfer_type !== "" && props.transfer_type !== "HOLIDAY" && (
          <Grid item xs={12} md={12}>
            <Field
              id="new_daily_sales_target_percentage"
              name="new_daily_sales_target_percentage"
              label="New Percent Daily Target"
              type="number"
              required={true}
              component={InputField}
              disabled
            />
          </Grid>
        )}
        {props.transfer_type === "TRANSFER" && (
          <Grid item xs={12} md={12}>
            <Field
              key={props.refresh}
              id="selected_subsection"
              name="selected_subsection"
              label="Warehouses (select where sales to be deducted)"
              options={salesTrackerUpdateSales?.user_access_organization_rights}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              // disable={active_page.generate == "1" ? false : true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("selected_subsection_code", newValue.code);
                }
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <Field
            id="remarks"
            name="remarks"
            label="Remarks"
            required={true}
            component={InputField}
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
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(UpdateSales);
const selector = formValueSelector(formName);
export default connect((state) => {
  const sales_daily_qouta = selector(state, "sales_daily_qouta");
  const sales_daily_out = selector(state, "sales_daily_out");
  const transfer_type = selector(state, "transfer_type");
  const refresh = state.SalesDailyOutReducer.refresh;
  return {
    sales_daily_qouta,
    sales_daily_out,
    transfer_type,
    refresh,
  };
}, {})(ReduxFormComponent);
