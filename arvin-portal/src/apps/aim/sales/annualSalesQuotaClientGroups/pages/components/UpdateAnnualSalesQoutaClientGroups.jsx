import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { putAnnualClientSalesTracker } from "../../actions/AnnualSalesQoutaClientGroupsActions";
import UpdateAnnualSalesQoutaClientGroupsHooks from "../../hooks/UpdateAnnualSalesQoutaClientGroupsHooks";
const formName = "UpdateAnnualSalesQoutaClientGroups";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(putAnnualClientSalesTracker(values));
    console.log(res);
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
              id="description"
              name="description"
              label={"Description"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field
              id="year_sales_target"
              name="year_sales_target"
              label={"Year"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field
              id="subsection"
              name="subsection"
              label={"Warehouse"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field
              id="product_group"
              name="product_group"
              label={"Product Group"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
              id="annual_sales_target"
              name="annual_sales_target"
              label={"Annual Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeYearQuota(e)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="january_sales_target"
              name="january_sales_target"
              label={"January Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "january_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "january_sales_target"
                )
              }
              min={1}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="february_sales_target"
              name="february_sales_target"
              label={"February Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "february_sales_target"
                )
              }
              onBlur={(e) => {
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "february_sales_target"
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="march_sales_target"
              name="march_sales_target"
              label={"March Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "march_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "march_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="april_sales_target"
              name="april_sales_target"
              label={"April Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "april_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "april_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="may_sales_target"
              name="may_sales_target"
              label={"May Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "may_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "may_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="june_sales_target"
              name="june_sales_target"
              label={"June Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "june_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "june_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="july_sales_target"
              name="july_sales_target"
              label={"July Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "july_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "july_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="august_sales_target"
              name="august_sales_target"
              label={"August Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "august_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "august_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="september_sales_target"
              name="september_sales_target"
              label={"September Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "september_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "september_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="october_sales_target"
              name="october_sales_target"
              label={"October Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "october_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "october_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="november_sales_target"
              name="november_sales_target"
              label={"November Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "november_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "november_sales_target"
                )
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="december_sales_target"
              name="december_sales_target"
              label={"December Quota"}
              required={true}
              component={InputField}
              type="number"
              onChange={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "december_sales_target"
                )
              }
              onBlur={(e) =>
                updateAnnualSalesQoutaClientGroups.onChangeMonthQuota(
                  e,
                  "december_sales_target"
                )
              }
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
                children={"Update Quota"}
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
  const subgroup = selector(state, "subgroup");
  const january_sales_target = selector(state, "january_sales_target");
  const february_sales_target = selector(state, "february_sales_target");
  const march_sales_target = selector(state, "march_sales_target");
  const april_sales_target = selector(state, "april_sales_target");
  const may_sales_target = selector(state, "may_sales_target");
  const june_sales_target = selector(state, "june_sales_target");
  const july_sales_target = selector(state, "july_sales_target");
  const august_sales_target = selector(state, "august_sales_target");
  const september_sales_target = selector(state, "september_sales_target");
  const october_sales_target = selector(state, "october_sales_target");
  const november_sales_target = selector(state, "november_sales_target");
  const december_sales_target = selector(state, "december_sales_target");
  return {
    subgroup,
    refresh,
    january_sales_target,
    february_sales_target,
    march_sales_target,
    april_sales_target,
    may_sales_target,
    june_sales_target,
    july_sales_target,
    august_sales_target,
    september_sales_target,
    october_sales_target,
    november_sales_target,
    december_sales_target,
  };
}, {})(ReduxFormComponent);
