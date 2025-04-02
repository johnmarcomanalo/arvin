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
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import InputYearPicker from "components/inputFIeld/InputYearPicker";
import Modal from "components/modal/Modal";
import { Constants } from "../../../../../../reducer/Contants";
import configure from "apps/configure/configure.json";
import { postSettingsAnnualQuotaClientGroups } from "../../actions/AnnualSalesQoutaClientGroupsActions";
import AddAnnualSalesQoutaClientGroupsHooks from "../../hooks/AddAnnualSalesQoutaClientGroupsHooks";
import ClientGroupList from "apps/aim/sales/clientGroups/pages/components/ClientGroupList";
import InputFieldButton from "components/inputFIeld/InputFieldButton";
import AddClientGroup from "apps/aim/sales/clientGroups/pages/components/AddClientGroup";
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
      {/* <Modal
        open={addAnnualSalesQoutaClientGroups?.viewModal}
        fullScreen={matches ? false : true}
        title={"Client List"}
        size={"md"}
        action={undefined}
        handleClose={addAnnualSalesQoutaClientGroups.onClickCloseViewModal}
      >
        <Customers
          // onClickSelect={
          //   addAnnualSalesQoutaClientGroups.onClickSelectClientList
          // }
        />
      </Modal> */}

      <Modal
        open={addAnnualSalesQoutaClientGroups?.addModal2}
        fullScreen={matches ? false : true}
        title={"Create Group"}
        size={"lg"}
        action={undefined}
        handleClose={addAnnualSalesQoutaClientGroups.onClickCloseAddModal2}
      >
        <AddClientGroup />
      </Modal>

      {/* <Modal
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
      </Modal> */}
      <Modal
        open={addAnnualSalesQoutaClientGroups.viewModal2}
        fullScreen={matches ? false : true}
        title={"Group Search"}
        size={"md"}
        action={undefined}
        handleClose={
          addAnnualSalesQoutaClientGroups.onClickCloseClientListViewModal
        }
      >
        <ClientGroupList
          onClickSelect={addAnnualSalesQoutaClientGroups.onClickSelectGroupList}
        />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="description"
              name="description"
              label={"Group Clients"}
              required={true}
              readOnly={true}
              component={InputFieldButton}
              onClick={() => {
                addAnnualSalesQoutaClientGroups.onClickOpenClientListViewModal();
              }}
              handleClick={() => {
                addAnnualSalesQoutaClientGroups.onClickRemoveSelectGroupList();
              }}
              inputIcon={<CloseIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
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
                fullwidth={false}
                children={"Create Group"}
                click={addAnnualSalesQoutaClientGroups.onClickOpenAddModal2}
              />
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
              id="bdo"
              name="bdo"
              label={"BDO"}
              required={true}
              disabled={true}
              component={InputField}
            />
          </Grid>
          {props.type === "SINGLE" && (
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
          )}
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
  const subgroup = selector(state, "subgroup");
  const ref_product_groups_uom_description = selector(
    state,
    "ref_product_groups_uom_description"
  );
  const type = selector(state, "type");
  return {
    refresh,
    subgroup,
    ref_product_groups_uom_description,
    monthly_sales_target,
    type,
  };
}, {})(ReduxFormComponent);
