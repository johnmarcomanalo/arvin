import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import InputYearPicker from "components/inputFIeld/InputYearPicker";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
import { postSettingsAnnualQuotaClientGroups } from "../../actions/AnnualSalesQoutaClientGroupsActions";
import UpdateAnnualSalesQoutaClientGroupsHooks from "../../hooks/UpdateAnnualSalesQoutaClientGroupsHooks";
const formName = "UpdateAnnualSalesQoutaClientGroups";
const submit = async (values, dispatch, props) => {
  try {
    values.year_sales_target = moment(values.year_sales_target).format("YYYY");
    const res = await dispatch(postSettingsAnnualQuotaClientGroups(values));
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

let UpdateAnnualSalesQoutaClientGroups = (props) => {
  const { ...updateAnnualSalesQoutaClientGroups } =
    UpdateAnnualSalesQoutaClientGroupsHooks(props);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="type"
              name="type"
              label={"Type"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Code
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Warehouse
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.subgroup?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.customer_code}</TableCell>
                        <TableCell>{value.description}</TableCell>
                        <TableCell>{value.type}</TableCell>
                        <TableCell>{value.subsection}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="type"
              name="type"
              label={"Type"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="subsection"
              name="subsection"
              label={"Warehouse"}
              required={true}
              disabled={true}
              component={InputField}
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
})(UpdateAnnualSalesQoutaClientGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return {
    refresh,
  };
}, {})(ReduxFormComponent);
