import { Grid, Stack } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputMonthPicker from "../../../../../../components/inputFIeld/InputMonthPicker";
import { Constants } from "../../../../../../reducer/Contants";
import { decryptaes } from "../../../../../../utils/LightSecurity";
import configure from "../../../../../configure/configure.json";
import { postPlacementAnnualSalesRanking } from "../../actions/SalesLeaderboardActions";
import SalesLeaderboardHooks from "../../hooks/SalesLeaderboardHooks";
const formName = "UpdateRanker";
const submit = async (values, dispatch, props) => {
  try {
    values.rank_code = props.selected_code;
    values.ref_month_code = moment(values.ref_month_code).format("MM");
    // console.log(values);
    const res = await dispatch(postPlacementAnnualSalesRanking(values));
    let decrypted = await decryptaes(res?.data);
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal3: false,
      },
    });
    await swal(decrypted.title, decrypted.message, decrypted.status);
    await reset();
  } catch (error) {
    console.log(error);
  }
};

let UpdateRanker = (props) => {
  const { ...salesLeaderboard } = SalesLeaderboardHooks(props);
  const account_details = salesLeaderboard.account_details;
  const sales_ranking_placements = salesLeaderboard.sales_ranking_placements;
  const selectedDataList = salesLeaderboard.selectedDataList;
  props.dispatch(change(formName, "added_by", account_details.code));
  props.dispatch(change(formName, "modified_by", account_details.code));
  props.dispatch(change(formName, "ranker_code", selectedDataList.ranker_code));
  props.dispatch(change(formName, "description", selectedDataList.description));
  props.dispatch(
    change(
      formName,
      "sales_daily_out_annual_sales_rankings_code",
      selectedDataList.code
    )
  );
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id={"description"}
              name={"description"}
              label="Description"
              required={true}
              component={InputField}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="ref_month_code"
              name="ref_month_code"
              label="Month"
              required={true}
              component={InputMonthPicker}
              placeholder="Month"
              value={moment(new Date()).format("MM")}
              disabled
              disablePast={false}
              disableFuture={true}
              disableSunday={true}
              showText={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="placement"
              name="placement"
              label="Placement"
              options={sales_ranking_placements}
              getOptionLabel={(option) =>
                option.description ? option.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change(
                    "ref_sales_ranking_placement_code",
                    newValue.code
                  );
                  props.change("placement", newValue.description);
                }
              }}
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
                children={"submit"}
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
})(UpdateRanker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const selected_code = state.SalesDailyOutReducer.selected_code;
  return { refresh, selected_code };
}, {})(ReduxFormComponent);
