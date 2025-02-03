import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, Stack, Tooltip, useMediaQuery } from "@mui/material";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import InputYearPicker from "../../../../../components/inputFIeld/InputYearPicker";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import AnnualSalesQoutaClientGroupsHooks from "../hooks/AnnualSalesQoutaClientGroupsHooks";
import AddAnnualSalesQoutaClientGroups from "./components/AddAnnualSalesQoutaClientGroups";
const formName = "AnnualSalesQoutaClientGroups";
let AnnualSalesQoutaClientGroups = (props) => {
  const { ...annualSalesQuotaClientGroups } =
    AnnualSalesQoutaClientGroupsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const active_page = annualSalesQuotaClientGroups?.active_page;

  return (
    <React.Fragment>
      <Modal
        open={annualSalesQuotaClientGroups?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Sale Quota"}
        size={"sm"}
        action={undefined}
        handleClose={annualSalesQuotaClientGroups.onClickCloseAddModal}
      >
        <AddAnnualSalesQoutaClientGroups />
      </Modal>
      {/* <Modal
        open={annualSalesQuotaClientGroups?.editModal}
        fullScreen={matches ? false : true}
        title={"Edit Monthly Sale Quota"}
        size={"xs"}
        action={undefined}
        handleClose={annualSalesQuotaClientGroups.onClickCloseEditModal}
      >
        <EditMonthlySaleQuota />
      </Modal> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-end" : "center"}
            alignItems={matches ? "flex-end" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <ButtonComponent
              stx={configure.default_button}
              iconType="add"
              type="button"
              fullWidth={true}
              children={"Add Quota"}
              click={annualSalesQuotaClientGroups.onClickOpenAddModal}
            />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <form onSubmit={props.handleSubmit}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <SearchField
                value={annualSalesQuotaClientGroups.search}
                onChange={annualSalesQuotaClientGroups.onChangeSearch}
              />
              <Field
                id="year_sales_target"
                name="year_sales_target"
                component={InputYearPicker}
                placeholder="Select Year"
                showText={false}
                onChange={(date) => {
                  let selectedDate = new Date();
                  if (date !== null) {
                    selectedDate = date;
                  }
                  annualSalesQuotaClientGroups.onChangeFilter(
                    moment(selectedDate).format("YYYY")
                  );
                }}
              />
            </Stack>
          </form>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <Page
              page={annualSalesQuotaClientGroups?.page}
              limit={annualSalesQuotaClientGroups?.dataListCount}
              status={""}
              onHandleChange={annualSalesQuotaClientGroups.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={annualSalesQuotaClientGroups.columns}
            dataList={annualSalesQuotaClientGroups.dataList}
            page={annualSalesQuotaClientGroups.page}
            rowsPerPage={annualSalesQuotaClientGroups.rowsPerPage}
            handleChangePage={annualSalesQuotaClientGroups.handleChangePage}
            handleChangeRowsPerPage={
              annualSalesQuotaClientGroups.handleChangeRowsPerPage
            }
            onSelectItem={annualSalesQuotaClientGroups.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={annualSalesQuotaClientGroups.dataListCount}
            actionshow={active_page.update === "1" ? true : false}
            paginationShow={false}
            subAction1Show={false}
            subAction2Show={active_page.update === "1" ? true : false}
            action={(row) => {
              return (
                <Tooltip title="Edit">
                  <IconButton size="small">
                    <EditIcon
                      onClick={() =>
                        annualSalesQuotaClientGroups.onClickOpenEditModal(row)
                      }
                      style={{
                        color: "#009197",
                        cursor: "pointer",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              );
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: "",
})(AnnualSalesQoutaClientGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
