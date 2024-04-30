import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesDailyOutComponentSalesDailyOutHooks from "../hooks/SalesDailyOutComponentSalesDailyOutHooks";
import Modal from "../../../../../components/modal/Modal";
import AddSalesDailyOut from "./components/AddSalesDailyOut";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import InputMonthYearPicker from "../../../../../components/inputFIeld/InputMonthYearPicker";
import moment from "moment";

const formName = "SalesDailyOut";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let DailyQuota = (props) => {
  const { ...salesDailyOutComponentSalesDailyOut } =
    SalesDailyOutComponentSalesDailyOutHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesDailyOutComponentSalesDailyOut?.addModal}
        fullScreen={matches ? false : true}
        title={"Sales Daily Out"}
        size={"xs"}
        action={undefined}
        handleClose={salesDailyOutComponentSalesDailyOut.onClickCloseAddModal}
      >
        <AddSalesDailyOut />
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
              click={salesDailyOutComponentSalesDailyOut.onClickOpenAddModal}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField
              value={salesDailyOutComponentSalesDailyOut.search}
              onChange={salesDailyOutComponentSalesDailyOut.onChangeSearch}
            />
            <form onSubmit={props.handleSubmit}>
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
                showText={false}
                // onChange={(e)=>{GetSalesDailyOut}}
              />
            </form>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={salesDailyOutComponentSalesDailyOut.columns}
            dataList={salesDailyOutComponentSalesDailyOut.dataList}
            page={salesDailyOutComponentSalesDailyOut.page}
            rowsPerPage={salesDailyOutComponentSalesDailyOut.rowsPerPage}
            handleChangePage={
              salesDailyOutComponentSalesDailyOut.handleChangePage
            }
            handleChangeRowsPerPage={
              salesDailyOutComponentSalesDailyOut.handleChangeRowsPerPage
            }
            onSelectItem={salesDailyOutComponentSalesDailyOut.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesDailyOutComponentSalesDailyOut.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      salesDailyOutComponentSalesDailyOut.onDeleteDeduction(row)
                    }
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
  onSubmit: submit,
})(DailyQuota);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
