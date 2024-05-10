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
import { postAnnualSettingSalesRanking } from "../../actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
import moment from "moment";
import swal from "sweetalert";
import { Button, ButtonGroup } from "@mui/material";
const formName = "AddAnnualSettingSalesRanking";
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
    console.log(value);
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

let AddAnnualSettingSalesRanking = (props) => {
  const dispatch = useDispatch();
  const { ...salesDailyOutComponentAnnualSettingSalesRanking } =
    SalesDailyOutComponentAnnualSettingSalesRankingHooks(props);
  const account_details =
    salesDailyOutComponentAnnualSettingSalesRanking?.account_details;
  const state = salesDailyOutComponentAnnualSettingSalesRanking?.state;
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
              <Grid container item xs={12} sm={12} md={12} lg={12}>
                <Grid item xs={12} md={12}>
                  <Field
                    id={"description-" + index}
                    name={"description-" + index}
                    label="Placement"
                    required={true}
                    component={InputField}
                    value={value.description}
                    onChange={(e) => {
                      salesDailyOutComponentAnnualSettingSalesRanking.onChangeRankingPlacement(
                        e,
                        index
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field
                    id={"value-" + index}
                    name={"value-" + index}
                    label="Value"
                    type="number"
                    required={true}
                    component={InputField}
                    value={value.value}
                    onChange={(e) => {
                      salesDailyOutComponentAnnualSettingSalesRanking.onChangeRankingPlacement(
                        e,
                        index
                      );
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
                    salesDailyOutComponentAnnualSettingSalesRanking.onClickAddRankingPlacement
                  }
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="delete"
                  type="button"
                  fullWidth={true}
                  children={"Remove"}
                  click={
                    salesDailyOutComponentAnnualSettingSalesRanking.onClickRemoveRankingPlacement
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
