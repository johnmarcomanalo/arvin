import { Grid, Stack } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import RefSubSectionsHooks from "../../../../settings/reference/hooks/RefSubSectionsHooks";
import { postSettingsAnnualQuota } from "../../actions/AnnualSalesQuotaActions";
import AnnualSalesQoutaHooks from "../../hooks/AnnualSalesQoutaClientGroupsHooks";
const formName = "AnnualSalesQoutaClientGroups";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    const res = await dispatch(postSettingsAnnualQuota(values));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal: false,
      },
    });
    swal(res.data.title, res.data.message, res.data.status);
    reset();
  } catch (error) {
    console.log(error);
  }
};

let AnnualSalesQoutaClientGroups = (props) => {
  const dispatch = useDispatch();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...annualSalesQouta } = AnnualSalesQoutaHooks(props);
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  props.dispatch(
    change(formName, "monthly_sales_target", monthly_sales_target)
  );
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <Field
                id="section"
                name="section"
                label="Section"
                options={annualSalesQouta?.sections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    refSubSections.GetReferenceSubSections(newValue.code);
                    props.change("section_code", newValue.code);
                    props.change("subsection_code", "");
                    props.change("subsection", "");
                    props.change("sub_section_type", "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="subsection"
                name="subsection"
                label="Sub-section"
                options={refSubSections?.subsections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    props.change("subsection_code", newValue.code);
                    props.change("sub_section_type", newValue.type);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="year_sales_target"
                name="year_sales_target"
                label="Select Year"
                required={true}
                component={InputYearPicker}
                placeholder="Select Year"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="ref_product_groups_description"
                name="ref_product_groups_description"
                label="Product Group"
                options={annualSalesQouta?.product_group_category}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    props.change("ref_product_groups_code", newValue.code);
                    props.change(
                      "ref_product_groups_uom_description",
                      newValue.uom_description
                    );
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="annual_sales_target"
                name="annual_sales_target"
                label={
                  "Target Annual Quota" +
                  (props.ref_product_groups_uom_description
                    ? " (" + props.ref_product_groups_uom_description + ")"
                    : "")
                }
                type="number"
                required={true}
                component={InputField}
                onChange={annualSalesQouta.GetMonthlyAndDailyQoutaByAnnualQouta}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="monthly_sales_target"
                name="monthly_sales_target"
                label={
                  "Target Month Quota" +
                  (props.ref_product_groups_uom_description
                    ? " (" + props.ref_product_groups_uom_description + ")"
                    : "")
                }
                type="number"
                required={true}
                disabled
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="date_effectiveness"
                name="date_effectiveness"
                label="Date Effective"
                type="date"
                component={InputField}
                required={true}
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
})(AnnualSalesQoutaClientGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const ref_product_groups_uom_description = selector(
    state,
    "ref_product_groups_uom_description"
  );
  return { refresh, ref_product_groups_uom_description };
}, {})(ReduxFormComponent);
