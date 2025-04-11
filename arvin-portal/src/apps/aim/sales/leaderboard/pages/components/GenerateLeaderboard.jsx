import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "apps/configure/configure.json";
import RefSalesRankingHooks from "../../../../settings/reference/hooks/RefSalesRankingHooks";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../../hooks/SalesLeaderboardHooks";
const formName = "GenerateAnnualSalesRanking";
let GenerateAnnualSalesRanking = (props) => {
  const { ...refSalesRanking } = RefSalesRankingHooks();
  const { ...salesDailyOutComponentAnnualSalesRanking } =
    SalesDailyOutComponentAnnualSalesRankingHooks();
  const account_details =
    salesDailyOutComponentAnnualSalesRanking.account_details;
  const submit = async (values, dispatch, props) => {
    try {
      await dispatch({
        type: Constants.ACTION_SALES_DAILY_OUT,
        payload: {
          selected_code: values?.rank_code,
          refresh: !props.refresh,
          addModal: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit(submit)}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              key={props.refresh}
              id="description"
              name="description"
              label="Rank List"
              options={refSalesRanking?.sales_ranking}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("rank_code", newValue.code);
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
                iconType="generate"
                type="submit"
                fullWidth={true}
                children={"Generate"}
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
})(GenerateAnnualSalesRanking);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
