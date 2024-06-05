import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesQoutaHooks from "../hooks/SalesQoutaHooks";
import AddSaleQuota from "./components/AddSaleQuota";
import InputYearPicker from "../../../../../components/inputFIeld/InputYearPicker";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
const formName = "SaleQouta";
let SalesQouta = (props) => {
  const { ...salesQouta } = SalesQoutaHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesQouta?.addModal}
        fullScreen={matches ? false : true}
        title={"Sale Quota"}
        size={"xs"}
        action={undefined}
        handleClose={salesQouta.onClickCloseAddModal}
      >
        <AddSaleQuota />
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
              click={salesQouta.onClickOpenAddModal}
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
                value={salesQouta.search}
                onChange={salesQouta.onChangeSearch}
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
                  salesQouta.onChangeFilter(
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
              page={salesQouta?.page}
              limit={salesQouta?.dataListCount}
              status={""}
              onHandleChange={salesQouta.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={salesQouta.columns}
            dataList={salesQouta.dataList}
            page={salesQouta.page}
            rowsPerPage={salesQouta.rowsPerPage}
            handleChangePage={salesQouta.handleChangePage}
            handleChangeRowsPerPage={salesQouta.handleChangeRowsPerPage}
            onSelectItem={salesQouta.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesQouta.dataListCount}
            actionShow={false}
            paginationShow={false}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() => salesQouta.onDeleteDeduction(row)}
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
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: "",
})(SalesQouta);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
