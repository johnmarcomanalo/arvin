import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
import moment from "moment";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import Modal from "../../../../../../components/modal/Modal";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "../../../../../configure/configure.json";
import Customers from "../../../../settings/accessrights/customerrights/pages/components/Customers";
import { postSettingsAnnualQuotaClientGroups } from "../../actions/AnnualSalesQoutaClientGroupsActions";
import AddAnnualSalesQoutaClientGroupsHooks from "../../hooks/AddAnnualSalesQoutaClientGroupsHooks";
const formName = "AddAnnualSalesQoutaClientGroups";
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
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let AddAnnualSalesQoutaClientGroups = (props) => {
  const matches = useMediaQuery("(min-width:600px)");

  const dispatch = useDispatch();
  const { ...addAnnualSalesQoutaClientGroups } =
    AddAnnualSalesQoutaClientGroupsHooks(props);

  props.dispatch(
    change(formName, "monthly_sales_target", props.monthly_sales_target)
  );
  const state = addAnnualSalesQoutaClientGroups.state;
  return (
    <React.Fragment>
      <Modal
        open={addAnnualSalesQoutaClientGroups?.viewModal}
        fullScreen={matches ? false : true}
        title={"Client List"}
        size={"md"}
        action={undefined}
        handleClose={addAnnualSalesQoutaClientGroups.onClickCloseViewModal}
      >
        <Customers
          onClickSelect={
            addAnnualSalesQoutaClientGroups.onClickSelectClientList
          }
        />
      </Modal>
      <Modal
        open={addAnnualSalesQoutaClientGroups.employeeModal}
        fullScreen={matches ? false : true}
        title={"Employee Search"}
        size={"md"}
        action={undefined}
        handleClose={
          addAnnualSalesQoutaClientGroups.onClickCloseEmployeeViewModal
        }
      >
        <AccountList
          onClickSelect={addAnnualSalesQoutaClientGroups.onClickSelectEmployee}
        />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="type"
              name="type"
              label="Type"
              options={state?.type}
              getOptionLabel={(option) =>
                option.description ? option.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                props.change("subgroups", []);
                props.change("type", newValue?.description);
              }}
            />
          </Grid>
          {props.type === "GROUP" && (
            <Grid item xs={12} md={12}>
              <Field
                id="description"
                name="description"
                label="Group Clients"
                options={addAnnualSalesQoutaClientGroups?.client_groups}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                // required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    props.change("subgroups", newValue.subgroup);
                    props.change(
                      "sales_daily_out_settings_client_group_code",
                      newValue.code
                    );
                  }
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Typography
                align="left"
                gutterBottom
                sx={{ color: configure.primary_color }}
              >
                Selected Clients
              </Typography>
              {props.type === "SINGLE" && (
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Add Client"}
                  click={addAnnualSalesQoutaClientGroups.onClickOpenViewModal}
                />
              )}
            </Stack>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.subgroups?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.customer_code}</TableCell>
                        <TableCell>{value.description}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
            <Field
              id="ref_product_groups_description"
              name="ref_product_groups_description"
              label="Product Group"
              options={addAnnualSalesQoutaClientGroups?.product_group_category}
              getOptionLabel={(option) =>
                option.description ? option.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("ref_product_groups_code", newValue.code);
                  props.change(
                    "ref_product_groups_uom_description",
                    newValue.uom_description
                  );
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="annual_sales_target"
              name="annual_sales_target"
              label={
                "Target Annual Quota" +
                (props.ref_product_groups_uom_description
                  ? " (" + props.ref_product_groups_uom_description + ")"
                  : "")
              }
              type="number"
              required={true}
              component={InputField}
              onChange={
                addAnnualSalesQoutaClientGroups.GetMonthlyAndDailyQoutaByAnnualQouta
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="monthly_sales_target"
              name="monthly_sales_target"
              label={
                "Target Month Quota" +
                (props.ref_product_groups_uom_description
                  ? " (" + props.ref_product_groups_uom_description + ")"
                  : "")
              }
              type="number"
              required={true}
              disabled
              component={InputField}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="bdo_name"
              name="bdo_name"
              label={"BDO"}
              required={true}
              disabled={true}
              component={InputField}
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
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Add BDO"}
                click={
                  addAnnualSalesQoutaClientGroups.onClickOpenEmployeeViewModal
                }
              />
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
})(AddAnnualSalesQoutaClientGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const monthly_sales_target = state.SalesDailyOutReducer.monthly_sales_target;
  const subgroups = selector(state, "subgroups");
  const ref_product_groups_uom_description = selector(
    state,
    "ref_product_groups_uom_description"
  );
  const type = selector(state, "type");
  return {
    refresh,
    subgroups,
    ref_product_groups_uom_description,
    monthly_sales_target,
    type,
  };
}, {})(ReduxFormComponent);
