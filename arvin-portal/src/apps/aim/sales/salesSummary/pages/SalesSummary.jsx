import UpgradeIcon from "@mui/icons-material/Upgrade";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesSummaryHooks from "../hooks/SalesSummaryHooks";
import AnnualSalesChart from "./charts/AnnualSalesChart";
import WarehouseSalesChart from "./charts/WarehouseSalesChart";
import CardDashComponent from "../../../../../components/card/CardDashComponent";
import CardGraphComponent from "../../../../../components/card/CardGraphComponent";
import Modal from "../../../../../components/modal/Modal";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FilterSalesSummary from "./components/FilterSalesSummary";
import InputMonthYearPicker from "../../../../../components/inputFIeld/InputMonthYearPicker";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
const formName = "SalesSummary";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let SalesSummary = (props) => {
  const { ...salesSummary } = SalesSummaryHooks(props);
  const showTableCards = salesSummary.showTableCards;
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesSummary?.addModal}
        fullScreen={matches ? false : true}
        title={"Filter Sales Summary"}
        size={"xs"}
        action={undefined}
        handleClose={salesSummary.onClickCloseAddModal}
      >
        <FilterSalesSummary />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <Field
                name="filter_from"
                label="Filter from"
                required={true}
                component={InputMonthYearPicker}
                placeholder="Filter from"
                value={moment(new Date()).startOf("year").format("MM-DD-YYYY")}
                disabled
                disablePast={false}
                disableFuture={true}
                disableSunday={true}
                showText={true}
                onChange={(date) => {
                  // salesTracker.filterMonthAndYear(date);
                }}
              />
              <Field
                name="filter_to"
                label="Filter to"
                required={true}
                component={InputMonthYearPicker}
                placeholder="Filter to"
                value={moment(new Date()).format("MM-DD-YYYY")}
                disabled
                disablePast={false}
                disableFuture={true}
                disableSunday={true}
                showText={true}
                onChange={(date) => {
                  // salesTracker.filterMonthAndYear(date);
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CardDashComponent
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
                  subtitle={"FINAL YTD"}
                  value={0}
                  fontSizeValue={18}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <AnnualSalesChart />
          </Grid>
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
                children={"Ranking Setup"}
                click={salesSummary.onClickOpenAddModal}
              />
              <ButtonComponent
                stx={configure.default_button}
                iconType={showTableCards === true ? "generate" : "graph"}
                type="button"
                fullWidth={true}
                children={showTableCards === true ? "Table View" : "Card View"}
                click={
                  showTableCards === true
                    ? salesSummary.onClickShowTableSummary
                    : salesSummary.onClickShowTableCardsSummary
                }
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
              <SearchField
                value={salesSummary.search}
                onChange={salesSummary.onChangeSearch}
              />
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
                page={salesSummary?.page}
                limit={salesSummary?.dataListCount}
                status={""}
                onHandleChange={salesSummary.handleChangePage}
              />
            </Stack>
          </Grid>
          {showTableCards ? (
            <Grid item xs={12} sm={12} md={12} lg={4}>
              <CardGraphComponent
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
                subtitle={"FINAL YTD"}
                value={0}
                fontSizeValue={18}
                subvalue={"this is sub value"}
                changeColorValue={true}
                graph={<WarehouseSalesChart />}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Table
                columns={salesSummary.columns}
                dataList={salesSummary.dataList}
                page={salesSummary.page}
                rowsPerPage={salesSummary.rowsPerPage}
                handleChangePage={salesSummary.handleChangePage}
                handleChangeRowsPerPage={salesSummary.handleChangeRowsPerPage}
                onSelectItem={salesSummary.onSelectItem}
                id={"home_attendance"}
                localStorage={""}
                rowCount={salesSummary.dataListCount}
                actionshow={false}
                paginationShow={false}
                action={(row) => {
                  return (
                    <Tooltip title="Update">
                      <UpgradeIcon
                        onClick={() => salesSummary.onSelectItemtoUpdate(row)}
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
          )}
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(SalesSummary);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
