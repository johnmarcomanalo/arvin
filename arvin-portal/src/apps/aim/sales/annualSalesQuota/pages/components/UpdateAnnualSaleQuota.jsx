import { Grid, Stack } from "@mui/material";
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { putAnnualSalesQuota } from "../../actions/AnnualSalesQuotaActions";
import UpdateAnnualSalesQoutaHooks from "../../hooks/UpdateAnnualSalesQoutaHooks";
const formName = "UpdateAnnualSaleQuota";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putAnnualSalesQuota(values));
    swal(res.data.title, res.data.message, res.data.icon);
    reset();
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        editModal: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let UpdateAnnualSaleQuota = (props) => {
  const dispatch = useDispatch();
  const { ...updateAnnualSalesQuota } = UpdateAnnualSalesQoutaHooks(props);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="sub_section"
              name="sub_section"
              label={"Subsection"}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="ref_product_groups_description"
              name="ref_product_groups_description"
              label={"Product Group"}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="year_sales_target"
              name="year_sales_target"
              label={"Year"}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="update_type"
              name="update_type"
              label="Update Type"
              options={updateAnnualSalesQuota?.updateType}
              getOptionLabel={(option) => option?.description}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("update_type", newValue.description);
                }
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            style={{
              display:
                props?.update_type === "RESET MONTH WITHOUT TRANSFER"
                  ? "flex"
                  : "none",
            }}
          >
            <Field
              id="reset_type"
              name="reset_type"
              label="Reset Type"
              options={updateAnnualSalesQuota?.resetType}
              getOptionLabel={(option) => option?.description}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("reset_type_code", newValue.code);
                }
              }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          mb={2}
          style={{
            display: props.update_type === "QUOTA" ? "flex" : "none",
          }}
        >
        {/* ----------------------------------------------------
      LEFT COLUMN — CURRENT QUOTA
  ----------------------------------------------------- */}
        <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  id="annual_sales_target"
                  name="annual_sales_target"
                  label="Annual Quota"
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="january_sales_target"
                  name="january_sales_target"
                  label="Current January Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="february_sales_target"
                  name="february_sales_target"
                  label="Current February Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="march_sales_target"
                  name="march_sales_target"
                  label="Current March Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="april_sales_target"
                  name="april_sales_target"
                  label="Current April Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="may_sales_target"
                  name="may_sales_target"
                  label="Current May Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="june_sales_target"
                  name="june_sales_target"
                  label="Current June Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="july_sales_target"
                  name="july_sales_target"
                  label="Current July Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="august_sales_target"
                  name="august_sales_target"
                  label="Current August Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="september_sales_target"
                  name="september_sales_target"
                  label="Current September Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="october_sales_target"
                  name="october_sales_target"
                  label="Current October Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="november_sales_target"
                  name="november_sales_target"
                  label="Current November Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="december_sales_target"
                  name="december_sales_target"
                  label="Current December Quota"
                  type="number"
                  required
                  disabled
                  component={InputField}
                />
              </Grid>
            </Grid>
          </Grid>

        {/* ----------------------------------------------------
      RIGHT COLUMN — NEW QUOTA
  ----------------------------------------------------- */}
        <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  id="new_annual_sales_target"
                  name="new_annual_sales_target"
                  label="New Annual Quota"
                  disabled
                  component={InputField}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_january_sales_target"
                  name="new_january_sales_target"
                  label="New January Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_january_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_february_sales_target"
                  name="new_february_sales_target"
                  label="New February Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_february_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_march_sales_target"
                  name="new_march_sales_target"
                  label="New March Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_march_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_april_sales_target"
                  name="new_april_sales_target"
                  label="New April Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_april_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_may_sales_target"
                  name="new_may_sales_target"
                  label="New May Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_may_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_june_sales_target"
                  name="new_june_sales_target"
                  label="New June Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_june_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_july_sales_target"
                  name="new_july_sales_target"
                  label="New July Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_july_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_august_sales_target"
                  name="new_august_sales_target"
                  label="New August Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_august_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_september_sales_target"
                  name="new_september_sales_target"
                  label="New September Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_september_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_october_sales_target"
                  name="new_october_sales_target"
                  label="New October Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_october_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_november_sales_target"
                  name="new_november_sales_target"
                  label="New November Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_november_sales_target"
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  id="new_december_sales_target"
                  name="new_december_sales_target"
                  label="New December Quota"
                  type="number"
                  required
                  component={InputField}
                  onChange={updateAnnualSalesQuota.handleMonthChange(
                    "new_december_sales_target"
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit"
                type="submit"
                fullWidth
              >
                Update Quota
              </ButtonComponent>
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
})(UpdateAnnualSaleQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const update_type = selector(state, "update_type");
  return { refresh, update_type };
}, {})(ReduxFormComponent);
