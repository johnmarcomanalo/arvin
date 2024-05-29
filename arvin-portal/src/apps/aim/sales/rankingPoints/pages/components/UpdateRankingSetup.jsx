import { ButtonGroup, Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import { putAnnualSettingSalesRanking } from "../../actions/SalesRankingPointsActions";
import SalesRankingPointsHooks from "../../hooks/SalesRankingPointsHooks";
import SalesRankingPointsUpdatePlacementHooks from "../../hooks/SalesRankingPointsUpdatePlacementHooks";
const formName = "UpdateRankingSetup";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putAnnualSettingSalesRanking(values));
    swal(res.data.title, res.data.message, res.data.status);
    reset();
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal3: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let UpdateRankingSetup = (props) => {
  const dispatch = useDispatch();
  const { ...salesRankingPoints } = SalesRankingPointsHooks(props);
  const { ...salesRankingPointsUpdatePlacement } =
    SalesRankingPointsUpdatePlacementHooks(props);
  const account_details = salesRankingPointsUpdatePlacement.account_details;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
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

          {/* <Grid item xs={12} md={12}>
            <Field
              id="type"
              name="type"
              label="Type"
              required={true}
              disabled
              component={InputField}
            />
          </Grid> */}
          {props.ranking_placement?.map((value, index) => {
            return (
              <Grid container spacing={2} item xs={12} sm={12} md={12} lg={12}>
                <Grid item xs={12} md={6}>
                  <Field
                    id={`description_${index}`}
                    name={`ranking_placement[${index}].description`}
                    label="Placement"
                    required={true}
                    component={InputField}
                    value={value.description}
                    onChange={(e) => {
                      // salesRankingPoints.onChangeRankingPlacement(
                      //   e,
                      //   index
                      // );
                      props.dispatch(
                        change(formName, "modified_by", account_details?.code)
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    id={`value_${index}`}
                    name={`ranking_placement[${index}].value`}
                    label={
                      typeof value.description === "undefined"
                        ? "" + " Value"
                        : value.description + " Value"
                    }
                    type="number"
                    required={true}
                    component={InputField}
                    value={value.value}
                    onChange={(e) => {
                      props.dispatch(
                        change(formName, "modified_by", account_details?.code)
                      );
                      // salesRankingPoints.onChangeRankingPlacement(
                      //   e,
                      //   index
                      // );
                    }}
                  />
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonGroup disableElevation aria-label="Disabled button group">
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Add"}
                  click={
                    salesRankingPointsUpdatePlacement.onClickAddRankingPlacement
                  }
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="delete"
                  type="button"
                  fullWidth={true}
                  children={"Remove"}
                  click={
                    salesRankingPointsUpdatePlacement.onClickRemoveRankingPlacement
                  }
                />
              </ButtonGroup>
            </Stack>
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
})(UpdateRankingSetup);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const ranking_placement = selector(state, "ranking_placement");
  return { refresh, ranking_placement };
}, {})(ReduxFormComponent);
