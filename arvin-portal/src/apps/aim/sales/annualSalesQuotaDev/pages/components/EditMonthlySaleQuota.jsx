import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import configure from "../../../../../configure/configure.json";
import { postUpdateQuotaPerMonth } from "../../actions/AnnualSalesQuotaActions";
import EditMonthlySalesQoutaHooks from "../../hooks/EditMonthlySalesQoutaHooks";
const formName = "EditMonthlySaleQuota";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postUpdateQuotaPerMonth(values));
    swal(res.data.title, res.data.message, res.data.icon);
    reset();
  } catch (error) {
    console.log(error);
  }
};

let EditMonthlySaleQuota = (props) => {
  const dispatch = useDispatch();
  const { ...editMonthlySalesQouta } = EditMonthlySalesQoutaHooks(props);
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  const selectedDataList = editMonthlySalesQouta.selectedDataList;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
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
              id="annual_sales_target"
              name="annual_sales_target"
              label={"Annual Quota"}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="month_description"
              name="month_description"
              label="Month"
              options={editMonthlySalesQouta?.months_to_change}
              getOptionLabel={(option) =>
                option.description ? option.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("month", newValue.value);
                  props.change(
                    "previous_monthly_sales_target",
                    selectedDataList[newValue.value]
                  );
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="previous_monthly_sales_target"
              name="previous_monthly_sales_target"
              label={"Current Month Quota"}
              type="number"
              required={true}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="monthly_sales_target"
              name="monthly_sales_target"
              label={"Updated Month Quota"}
              type="number"
              required={true}
              component={InputField}
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
                iconType="submit"
                type="submit"
                fullWidth={true}
                children={"Update Quota"}
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
})(EditMonthlySaleQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const ref_product_groups_uom_description = selector(
    state,
    "ref_product_groups_uom_description"
  );
  return { refresh, ref_product_groups_uom_description };
}, {})(ReduxFormComponent);
