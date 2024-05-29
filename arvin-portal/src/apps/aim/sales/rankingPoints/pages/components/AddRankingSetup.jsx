import { ButtonGroup, Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import { postAnnualSettingSalesRanking } from "../../actions/SalesRankingPointsActions";
import SalesRankingPointsHooks from "../../hooks/SalesRankingPointsHooks";
const formName = "AddRankingSetup";
const submit = async (values, dispatch, props) => {
  try {
    let ranking_placement = values.ranking_placement.map((item) => {
      const newItem = { index: item.index };
      Object.keys(item).forEach((key) => {
        if (key.startsWith("description-")) {
          newItem.desc = item[key];
        } else if (key.startsWith("value-")) {
          newItem.val = item[key];
        }
      });
      return newItem;
    });

    let value = {
      description: values.description,
      value: values.value,
      type: values.type,
      ranking_placement: ranking_placement,
      added_by: values.added_by,
      modified_by: values.modified_by,
    };
    const res = await dispatch(postAnnualSettingSalesRanking(value));
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

let AddRankingSetup = (props) => {
  const dispatch = useDispatch();
  const { ...salesRankingPoints } = SalesRankingPointsHooks(props);
  const account_details = salesRankingPoints?.account_details;
  const state = salesRankingPoints?.state;
  props.dispatch(change(formName, "type", "Year"));
  props.dispatch(change(formName, "added_by", account_details?.code));
  props.dispatch(change(formName, "modified_by", account_details?.code));
  props.dispatch(
    change(formName, "ranking_placement", state?.ranking_placement)
  );
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
          {state.ranking_placement?.map((value, index) => {
            return (
              <Grid container spacing={2} item xs={12} sm={12} md={12} lg={12}>
                <Grid item xs={12} md={6}>
                  <Field
                    id={"description-" + index}
                    name={"description-" + index}
                    label="Placement"
                    required={true}
                    component={InputField}
                    value={value.description}
                    onChange={(e) => {
                      salesRankingPoints.onChangeRankingPlacement(e, index);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    id={"value-" + index}
                    name={"value-" + index}
                    label={"Values"}
                    type="number"
                    required={true}
                    component={InputField}
                    value={value.value}
                    onChange={(e) => {
                      salesRankingPoints.onChangeRankingPlacement(e, index);
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
                  click={salesRankingPoints.onClickAddRankingPlacement}
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="delete"
                  type="button"
                  fullWidth={true}
                  children={"Remove"}
                  click={salesRankingPoints.onClickRemoveRankingPlacement}
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
})(AddRankingSetup);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
