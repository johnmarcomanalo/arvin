import CloseIcon from "@mui/icons-material/Close";
import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import Table from "components/table/Table";
// import FilterSalesSummary from "components/FilterSalesSummary";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
import InputFieldButton from "components/inputFIeld/InputFieldButton";
import Modal from "components/modal/Modal";
import moment from "moment";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "components/autoComplete/AutoComplete";
import ComponentTitle from "components/componentTitle/componentTitle";
import InputYearPicker from "components/inputFIeld/InputYearPicker";
import ClientSalesSummaryHooks from "../hooks/ClientSalesSummaryHooks";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import Page from "components/pagination/Pagination";
import SearchField from "components/inputFIeld/SearchField";
const formName = "ClientSummary";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let ClientSummary = (props) => {
  const { ...clientSalesSummary } = ClientSalesSummaryHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const types = [
    { description: "Manila Branch" },
    { description: "Provincial" },
    { description: "Peanut" },
  ];
  return (
    <React.Fragment>
      <Modal
        open={clientSalesSummary.employeeModal}
        fullScreen={matches ? false : true}
        title={"Account Search"}
        size={"md"}
        action={undefined}
        handleClose={clientSalesSummary.onClickCloseEmployeeViewModal}
      >
        <AccountList onClickSelect={clientSalesSummary.onChangeFilterBDO} />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <SearchField
              value={clientSalesSummary.search}
              onChange={clientSalesSummary.onChangeSearch}
              textHidden={false}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            {" "}
            <Field
              id="filter_year"
              name="filter_year"
              label="Select Year"
              required={false}
              value={clientSalesSummary.filterQuery}
              component={InputYearPicker}
              placeholder="Select Year"
              onChange={(date) => {
                let selectedDate = new Date();
                if (date !== null) {
                  selectedDate = date;
                }
                clientSalesSummary.onChangeFilterYear(
                  moment(selectedDate).format("YYYY")
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              id="bdo_name"
              name="bdo_name"
              label="BDO"
              component={InputFieldButton}
              readOnly={true}
              multiline={1}
              onClick={() => {
                clientSalesSummary.onClickOpenEmployeeViewModal();
              }}
              handleClick={() => {
                clientSalesSummary.onClickSelectResetEmployee();
              }}
              inputIcon={<CloseIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            {" "}
            <Field
              key={props.refresh}
              id="product_group"
              name="product_group"
              label="Product"
              options={clientSalesSummary?.user_access_product_group_rights}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              // disable={active_page.generate == "1" ? false : true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  clientSalesSummary.onChangeFilterProduct(
                    newValue.description
                  );
                } else {
                  clientSalesSummary.onChangeFilterProduct("");
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
                  clientSalesSummary.onClickSelectType(newValue?.description);
                } else {
                  clientSalesSummary.onClickSelectType("");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Field
              id="subsection"
              name="subsection"
              label="Warehouse"
              options={clientSalesSummary?.user_access_organization_rights}
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
                  clientSalesSummary.onClickSelectWarehouse(newValue?.type);
                } else {
                  clientSalesSummary.onClickSelectWarehouse("");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack justifyContent="flex-end" alignItems="flex-end">
              <Page
                page={clientSalesSummary?.page}
                limit={clientSalesSummary?.dataListCount}
                onHandleChange={clientSalesSummary.handleChangePage}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title="Monthly Sales Summary"
                // subtitle={moment(new Date()).format("MMMM YYYY")}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
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
                click={() =>
                  clientSalesSummary.exportToExcelMonthlySalesSummary(
                    clientSalesSummary?.dataList
                  )
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={clientSalesSummary.columns_out}
              dataList={clientSalesSummary.dataList}
              page={clientSalesSummary.page}
              rowsPerPage={clientSalesSummary.rowsPerPage}
              handleChangePage={clientSalesSummary.handleChangePage}
              handleChangeRowsPerPage={
                clientSalesSummary.handleChangeRowsPerPage
              }
              onSelectItem={clientSalesSummary.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={clientSalesSummary.otherSales?.length}
              actionshow={false}
              paginationShow={false}
              changeZerotoDash={true}
              sticky={true}
              action={(row) => {
                return null;
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title="Monthly MTD Sales Summary"
                // subtitle={moment(new Date()).format("MMMM YYYY")}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
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
                click={() =>
                  clientSalesSummary.exportToExcelMonthlyMTDSummary(
                    clientSalesSummary?.dataList
                  )
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={clientSalesSummary.columns_mtd_final_percentage}
              dataList={clientSalesSummary.dataList}
              page={clientSalesSummary.page}
              rowsPerPage={clientSalesSummary.rowsPerPage}
              handleChangePage={clientSalesSummary.handleChangePage}
              handleChangeRowsPerPage={
                clientSalesSummary.handleChangeRowsPerPage
              }
              onSelectItem={clientSalesSummary.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={clientSalesSummary.otherSales?.length}
              actionshow={false}
              changeZerotoDash={true}
              paginationShow={false}
              sticky={true}
              action={(row) => {
                return null;
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title="Monthly YTD Sales Summary"
                // subtitle={moment(new Date()).format("MMMM YYYY")}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
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
                click={() =>
                  clientSalesSummary.exportToExcelMonthlyYTDSummary(
                    clientSalesSummary?.dataList
                  )
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={clientSalesSummary.columns_ytd_final_percentage}
              dataList={clientSalesSummary.dataList}
              page={clientSalesSummary.page}
              rowsPerPage={clientSalesSummary.rowsPerPage}
              handleChangePage={clientSalesSummary.handleChangePage}
              handleChangeRowsPerPage={
                clientSalesSummary.handleChangeRowsPerPage
              }
              onSelectItem={clientSalesSummary.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={clientSalesSummary.otherSales?.length}
              actionshow={false}
              changeZerotoDash={true}
              paginationShow={false}
              sticky={true}
              action={(row) => {
                return null;
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
})(ClientSummary);
const selector = formValueSelector(formName);
export default connect((state) => {
  const product = selector(state, "product");
  const bdo_name = selector(state, "bdo_name");
  const type = selector(state, "type");
  const subsection = selector(state, "subsection");
  return { product, type, bdo_name, subsection };
}, {})(ReduxFormComponent);
