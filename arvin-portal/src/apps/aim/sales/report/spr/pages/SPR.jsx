import { Grid, Stack, useMediaQuery } from "@mui/material";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import SPRHooks from "../hooks/SPRHooks";
import ViewPrintWeeklySPRReport from "./component/ViewPrintWeeklySPRReport";
import ComboBox from "components/autoComplete/AutoComplete";
import { postSPRPrint } from "../actions/SPRActions";
import { Constants } from "reducer/Contants";
import { decryptaes } from "utils/LightSecurity";
const formName = "SPR";

const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postSPRPrint(values));
    let decrypted = decryptaes(response?.data);
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        spr: decrypted,
      },
    });
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let SPR = (props) => {
  const { ...spr } = SPRHooks(props);
  const spr_data = spr.spr_data;
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Field
                    key={props.refresh}
                    id="warehouse"
                    name="warehouse"
                    component={ComboBox}
                    label="Warehouse"
                    options={spr?.warehouse}
                    getOptionLabel={(option) => option?.description}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field
                    id="date_start"
                    name="date_start"
                    label="Date Start"
                    required={true}
                    type="date"
                    component={InputField}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field
                    id="date_end"
                    name="date_end"
                    label="Date End"
                    required={true}
                    type="date"
                    component={InputField}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <ButtonComponent
                    stx={configure.default_button}
                    iconType="submit"
                    type="submit"
                    fullWidth={true}
                    children={"Submit"}
                  />
                </Grid>
              </Grid>
            </form>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={10} lg={10}>
          <ViewPrintWeeklySPRReport
            warehouse={props.warehouse}
            date_start={props.date_start}
            date_end={props.date_end}
            data={spr_data}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(SPR);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const warehouse = selector(state, "warehouse");
  const date_start = selector(state, "date_start");
  const date_end = selector(state, "date_end");

  return {
    refresh,
    warehouse,
    date_start,
    date_end,
  };
}, {})(ReduxFormComponent);
