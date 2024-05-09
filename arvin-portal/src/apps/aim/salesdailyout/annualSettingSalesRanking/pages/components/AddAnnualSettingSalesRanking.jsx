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
import SalesDailyOutComponentAnnualSettingSalesRankingHooks from "../../hooks/SalesDailyOutComponentAnnualSettingSalesRankingHooks";
import { postAnnualTargetSales } from "../../actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
import moment from "moment";
import swal from "sweetalert";
const formName = "AddAnnualSettingSalesRanking";
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

let AddAnnualSettingSalesRanking = (props) => {
  const dispatch = useDispatch();
  const { ...salesDailyOutComponentAnnualSettingSalesRanking } =
    SalesDailyOutComponentAnnualSettingSalesRankingHooks(props);
  const account_details =
    salesDailyOutComponentAnnualSettingSalesRanking?.account_details;
  console.log(salesDailyOutComponentAnnualSettingSalesRanking);
  props.dispatch(change(formName, "type", "Year"));
  props.dispatch(change(formName, "added_by", account_details?.code));
  props.dispatch(change(formName, "modified_by", account_details?.code));
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <Field
                id="description"
                name="description"
                label="Description"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="value"
                name="value"
                label="Target"
                type="number"
                required={true}
                component={InputField}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Field
                id="type"
                name="type"
                label="Type"
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
                children={"Add Annual Ranking"}
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
})(AddAnnualSettingSalesRanking);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
