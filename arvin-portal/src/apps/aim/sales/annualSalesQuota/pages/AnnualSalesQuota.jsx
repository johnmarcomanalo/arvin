import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, Stack, Tooltip, useMediaQuery } from "@mui/material";
import configure from "apps/configure/configure.json";
import ButtonComponent from "components/button/Button";
import InputYearPicker from "components/inputFIeld/InputYearPicker";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import SalesQoutaHooks from "../hooks/AnnualSalesQoutaHooks";
import AddAnnualSaleQuota from "./components/AddAnnualSaleQuota";
import EditMonthlySaleQuota from "./components/EditMonthlySaleQuota";
import UpdateAnnualSaleQuota from "./components/UpdateAnnualSaleQuota";
const formName = "AnnualSalesQuota";
let AnnualSalesQuota = (props) => {
  const { ...annualSalesQuota } = SalesQoutaHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const active_page = annualSalesQuota?.active_page;

  return (
    <React.Fragment>
      <Modal
        open={annualSalesQuota?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Sale Quota"}
        size={"xs"}
        action={undefined}
        handleClose={annualSalesQuota.onClickCloseAddModal}
      >
        <AddAnnualSaleQuota />
      </Modal>
      <Modal
        open={annualSalesQuota?.editModal}
        fullScreen={matches ? false : true}
        title={"Edit Monthly Sale Quota"}
        size={"xs"}
        action={undefined}
        handleClose={annualSalesQuota.onClickCloseEditModal}
      >
        <EditMonthlySaleQuota />
      </Modal>
      <Modal
        open={annualSalesQuota?.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Monthly Sale Quota"}
        size={"sm"}
        action={undefined}
        handleClose={annualSalesQuota.onClickCloseUpdateModal}
      >
        <UpdateAnnualSaleQuota />
      </Modal>
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
              click={annualSalesQuota.onClickOpenAddModal}
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
                value={annualSalesQuota.search}
                onChange={annualSalesQuota.onChangeSearch}
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
                  annualSalesQuota.onChangeFilter(
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
              page={annualSalesQuota?.page}
              limit={annualSalesQuota?.dataListCount}
              status={""}
              onHandleChange={annualSalesQuota.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={annualSalesQuota.columns}
            dataList={annualSalesQuota.dataList}
            page={annualSalesQuota.page}
            rowsPerPage={annualSalesQuota.rowsPerPage}
            handleChangePage={annualSalesQuota.handleChangePage}
            handleChangeRowsPerPage={annualSalesQuota.handleChangeRowsPerPage}
            onSelectItem={annualSalesQuota.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={annualSalesQuota.dataListCount}
            actionshow={active_page.update === "1" ? true : false}
            paginationShow={false}
            subAction1Show={active_page.update === "1" ? true : false}
            subAction2Show={active_page.update === "1" ? true : false}
            action={(row) => {
              return (
                <Tooltip title="Edit">
                  <IconButton size="small">
                    <EditIcon
                      onClick={() => annualSalesQuota.onClickOpenEditModal(row)}
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
})(AnnualSalesQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
