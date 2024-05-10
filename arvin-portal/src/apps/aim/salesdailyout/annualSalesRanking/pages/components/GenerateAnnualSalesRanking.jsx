import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import { Constants } from "../../../../../../reducer/Contants";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../../hooks/SalesDailyOutComponentAnnualSalesRankingHooks";
import { postAnnualTargetSales } from "../../actions/SalesDailyOutComponentAnnualSalesRankingActions";
import moment from "moment";
import swal from "sweetalert";
const formName = "AddAnnualQuota";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    const res = await dispatch(postAnnualTargetSales(values));
    swal(res.data.title, res.data.message, res.data.status);
    reset();
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let AddAnnualSettingSale = (props) => {
  const dispatch = useDispatch();
  const { ...refCompanies } = RefCompaniesHooks();
  const { ...refBusinessUnits } = RefBusinessUnitsHooks();
  const { ...refTeams } = RefTeamsHooks();
  const { ...refDepartments } = RefDepartmentsHooks();
  const { ...refSections } = RefSectionsHooks();
  const { ...refSubSections } = RefSubSectionsHooks();
  const { ...salesDailyOutComponentAnnualSettingSale } =
    SalesDailyOutComponentAnnualSalesRankingHooks(props);

  const annual_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.annual_sales_target
  );
  const monthly_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.monthly_sales_target
  );
  const daily_sales_target = useSelector(
    (state) => state.SalesDailyOutReducer.daily_sales_target
  );

  props.dispatch(change(formName, "annual_sales_target", annual_sales_target));
  props.dispatch(
    change(formName, "monthly_sales_target", monthly_sales_target)
  );
  props.dispatch(change(formName, "daily_sales_target", daily_sales_target));
  props.dispatch(change(formName, "added_by", 1));
  props.dispatch(change(formName, "modified_by", 1));
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="description"
              name="description"
              label="Rank List"
              options={refCompanies?.companies}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              // onChangeHandle={(e, newValue) => {
              //   if (newValue?.description) {
              //     dispatch({
              //       type: Constants.ACTION_REFERENCE,
              //       payload: {
              //         teams: [],
              //         departments: [],
              //         sections: [],
              //         subsections: [],
              //       },
              //     });
              //     refBusinessUnits.GetReferenceBusinessUnits(newValue.code);
              //     props.change("company_code", newValue.code);
              //     props.change("business_unit", "");
              //     props.change("business_unit_code", "");
              //     props.change("team", "");
              //     props.change("team_code", "");
              //     props.change("department", "");
              //     props.change("department_code", "");
              //     props.change("section", "");
              //     props.change("section_code", "");
              //     props.change("subsection_code", "");
              //     props.change("subsection", "");
              //   }
              // }}
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
                iconType="generate"
                type="submit"
                fullWidth={true}
                children={"Generate Table"}
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
})(AddAnnualSettingSale);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
