import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import IsoIcon from "@mui/icons-material/Iso";
import PercentIcon from "@mui/icons-material/Percent";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import CardComponent from "../../../../../components/card/CardComponent";
import InputMonthYearPicker from "../../../../../components/inputFIeld/InputMonthYearPicker";
import Modal from "../../../../../components/modal/Modal";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesTrackerHooks from "../hooks/SalesTrackerHooks";
import AddSales from "./components/AddSales";
const formName = "SalesTracker";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let SalesTracker = (props) => {
  const { ...salesTracker } = SalesTrackerHooks(props);
  const report_data = salesTracker.report_data;
  const present_mtd_data = salesTracker.present_mtd_data;
  const previous_mtd_data = salesTracker.previous_mtd_data;
  const final_mtd_data = salesTracker.final_mtd_data;
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesTracker?.addModal}
        fullScreen={matches ? false : true}
        title={"Sales Tracker"}
        size={"xs"}
        action={undefined}
        handleClose={salesTracker.onClickCloseAddModal}
      >
        <AddSales />
      </Modal>

      <Grid container spacing={2}>
        <Grid item sm={12} md={3}>
          <CardComponent
            icon={
              <FlagCircleOutlinedIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            title={"Year"}
            subtitle={"ANNUAL TARGET SALE"}
            value={salesTracker.annual_sales_target}
            subvalue={"this is sub value"}
          />
        </Grid>
        <Grid item sm={12} md={3}>
          <CardComponent
            icon={
              <FlagCircleOutlinedIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Month"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"MONTH TARGET SALE"}
            value={salesTracker.monthly_sales_target}
            subvalue={"this is sub value"}
          />
        </Grid>
        <Grid item sm={12} md={3}>
          <CardComponent
            icon={
              <FlagCircleOutlinedIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"DAY TARGET SALE"}
            value={salesTracker.daily_sales_target}
            subvalue={"this is sub value"}
          />
        </Grid>
        <Grid item sm={12} md={3}>
          <CardComponent
            icon={
              <PercentIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"FINAL YTD"}
            value={
              typeof final_mtd_data !== "undefined"
                ? parseFloat(final_mtd_data).toFixed(2)
                : 0
            }
            fontSizeValue={18}
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <AttachMoneyIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"TOTAL DAILY QOUTA"}
            value={
              typeof report_data?.total_target_daily_quota_amount !==
              "undefined"
                ? report_data?.total_target_daily_quota_amount
                : 0
            }
            subvalue={"this is sub value"}
          />
        </Grid>
        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <AttachMoneyIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"TOTAL OUT SALES"}
            value={
              typeof report_data?.total_daily_out_amount !== "undefined"
                ? report_data?.total_daily_out_amount
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <CalendarTodayIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"TOTAL STATUS TARGET"}
            value={
              typeof report_data?.total_status_daily_target_amount !==
              "undefined"
                ? report_data?.total_status_daily_target_amount
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <PercentIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"TOTAL PERCENT TARGET"}
            value={
              typeof present_mtd_data?.mtdFinal !== "undefined"
                ? present_mtd_data?.mtdFinal
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>

        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <PercentIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"% LOSS/EXCESS (PREV MO)"}
            value={
              typeof previous_mtd_data?.mtdFinal !== "undefined"
                ? parseFloat(previous_mtd_data?.mtdFinal).toFixed(2)
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>

        <Grid item sm={12} md={2}>
          <CardComponent
            icon={
              <IsoIcon
                sx={{
                  backgroundColor: "white",
                  color: configure.primary_color,
                }}
              />
            }
            title={"Day"}
            icon_color={configure.primary_color}
            icon_bg_color={"white"}
            subtitle={"LOSS/EXCESS (PREV MO):"}
            value={
              typeof previous_mtd_data?.mtdTotalStatusDailyTarget !==
              "undefined"
                ? parseFloat(
                    previous_mtd_data?.mtdTotalStatusDailyTarget
                  ).toFixed(2)
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-end" : "center"}
            alignItems={matches ? "flex-end" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
            sx={{ marginTop: 2 }}
          >
            <ButtonComponent
              stx={configure.default_button}
              iconType="add"
              type="button"
              fullWidth={true}
              children={"Add Today's Sale"}
              click={salesTracker.onClickOpenAddModal}
            />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            {/* <SearchField
              value={salesTracker.search}
              onChange={salesTracker.onChangeSearch}
            /> */}
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
                onChange={(date) => {
                  salesTracker.filterMonthAndYear(date);
                }}
              />
            </form>
          </Stack>
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
              page={salesTracker?.page}
              limit={salesTracker?.dataListCount}
              status={""}
              onHandleChange={salesTracker.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
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
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(SalesTracker);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
