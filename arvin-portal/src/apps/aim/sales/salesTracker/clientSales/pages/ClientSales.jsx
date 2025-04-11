import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputFieldButton from "components/inputFIeld/InputFieldButton";
import InputMonthYearPicker from "components/inputFIeld/InputMonthYearPicker";
import Modal from "components/modal/Modal";
import ComponentTable from "components/table/Table";
import configure from "apps/configure/configure.json";
import ClientSalesHooks from "../hooks/ClientSalesHooks";
import SearchField from "components/inputFIeld/SearchField";
import FilterClientSalesTracker from "./components/FilterClientSalesTracker";
import Page from "components/pagination/Pagination";
const formName = "ClientSales";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let ClientSales = (props) => {
  const { ...salesTracker } = ClientSalesHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const types = [
    { description: "Manila Branch" },
    { description: "Provincial" },
    { description: "Peanut" },
  ];
  return (
    <React.Fragment>
      <Modal
        open={salesTracker.employeeModal}
        fullScreen={matches ? false : true}
        title={"Account Search"}
        size={"md"}
        action={undefined}
        handleClose={salesTracker.onClickCloseEmployeeViewModal}
      >
        <AccountList onClickSelect={salesTracker.onClickSelectEmployee} />
      </Modal>
      <Modal
        open={salesTracker.filterModal}
        fullScreen={matches ? false : true}
        title={"Account Search"}
        size={"md"}
        action={undefined}
        handleClose={salesTracker.onClickCloseFilterModal}
      >
        <FilterClientSalesTracker />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={"flex-end"}
              alignItems={"center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="export"
                type="export"
                fullWidth={true}
                children={"Export Table"}
                click={() => salesTracker.exportToExcel(salesTracker?.dataList)}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <SearchField
              value={salesTracker.search}
              onChange={salesTracker.onChangeSearch}
              textHidden={false}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              name="sales_date"
              label="Date"
              required={true}
              component={InputMonthYearPicker}
              placeholder="Date"
              value={moment(new Date()).format("MM-DD-YYYY")}
              disabled
              disablePast={false}
              disableFuture={true}
              disableSunday={true}
              showText={true}
              onChange={(date) => {
                salesTracker.filterMonthAndYear(date);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              key={props.refresh}
              id="product_group"
              name="product_group"
              required={true}
              label="Product"
              options={salesTracker?.user_access_product_group_rights}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              // disable={active_page.generate == "1" ? false : true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  salesTracker.filterProductGroups(newValue?.description);
                } else {
                  salesTracker.filterProductGroups("");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              id="type"
              name="type"
              label="Type"
              options={types}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  salesTracker.onClickSelectType(newValue?.description);
                } else {
                  salesTracker.onClickSelectType("");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              id="subsection"
              name="subsection"
              label="Warehouse"
              options={salesTracker?.user_access_organization_rights}
              getOptionLabel={(option) =>
                option?.description
                  ? option.description
                  : props.subsection
                  ? props.subsection
                  : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  console.log(newValue);
                  salesTracker.onClickSelectWarehouse(newValue?.type);
                } else {
                  salesTracker.onClickSelectWarehouse("");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              id="bdo_name"
              required={true}
              name="bdo_name"
              label="BDO"
              component={InputFieldButton}
              readOnly={true}
              multiline={1}
              onClick={() => {
                salesTracker.onClickOpenEmployeeViewModal();
              }}
              handleClick={() => {
                salesTracker.onClickSelectResetEmployee();
              }}
              inputIcon={<CloseIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack justifyContent="flex-end" alignItems="flex-end">
              <Page
                page={salesTracker?.page}
                limit={salesTracker?.dataListCount}
                onHandleChange={salesTracker.handleChangePage}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <ComponentTable
              columns={salesTracker.columns}
              dataList={salesTracker.dataList}
              page={salesTracker.page}
              rowsPerPage={salesTracker.rowsPerPage}
              handleChangePage={salesTracker.handleChangePage}
              handleChangeRowsPerPage={salesTracker.handleChangeRowsPerPage}
              onSelectItem={salesTracker.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={salesTracker.dataListCount}
              paginationShow={false}
              action={(row) => {
                return (
                  <Tooltip title="Delete">
                    <DeleteOutlineIcon
                      onClick={() => salesTracker.onDeleteDeduction(row)}
                      style={{
                        color: "#009197",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                );
              }}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ClientSales);
const selector = formValueSelector(formName);
export default connect((state) => {
  const sales_date = selector(state, "sales_date");
  const product_group = selector(state, "product_group");
  const bdo_name = selector(state, "bdo_name");
  const type = selector(state, "type");
  const subsection = selector(state, "subsection");
  return {
    sales_date,
    product_group,
    type,
    bdo_name,
    subsection,
  };
}, {})(ReduxFormComponent);
