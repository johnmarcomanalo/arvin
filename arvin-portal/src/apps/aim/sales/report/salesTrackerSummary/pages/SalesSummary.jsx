import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import {
  Grid,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table as Tbl,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import ButtonComponent from "../../../../../../components/button/Button";
import CardDashComponent from "../../../../../../components/card/CardDashComponent";
import CardGraphComponent from "../../../../../../components/card/CardGraphComponent";
import Table from "../../../../../../components/table/Table";
import configure from "../../../../../configure/configure.json";
import AnnualSalesChart from "./charts/AnnualSalesChart";
import WarehouseSalesChart from "./charts/WarehouseSalesChart";
// import FilterSalesSummary from "./components/FilterSalesSummary";
import moment from "moment";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import ComponentTitle from "../../../../../../components/componentTitle/componentTitle";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import { ViewAmountFormatingDecimals } from "../../../../../../utils/AccountingUtils";
import SalesSummaryHooks from "../hooks/SalesSummaryHooks";
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
  const annual_sales_mtd_ytd_subsections_columns =
    salesSummary.annual_sales_mtd_ytd_subsections_columns;
  const annual_sales_mtd_ytd_subsections =
    salesSummary.annual_sales_mtd_ytd_subsections;
  const showMTDTable = salesSummary.showMTDTable;
  const showbdoTable = salesSummary.showbdoTable;
  const showprovTable = salesSummary.showprovTable;
  const total_daily_out_amount = salesSummary.total_daily_out_amount;
  const annual_set_subsections = salesSummary?.annual_set_subsections;
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      {/* <Modal
        open={salesSummary?.addModal}
        fullScreen={matches ? false : true}
        title={"Filter Sales Summary"}
        size={"xs"}
        action={undefined}
        handleClose={salesSummary.onClickCloseAddModal}
      >
        <FilterSalesSummary />
      </Modal> */}
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              alignContent={"flex-end"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <Field
                id="filter_year"
                name="filter_year"
                label="Select Year"
                required={false}
                value={salesSummary.filterQuery}
                component={InputYearPicker}
                placeholder="Select Year"
                onChange={(date) => {
                  let selectedDate = new Date();
                  if (date !== null) {
                    selectedDate = date;
                  }
                  salesSummary.onChangeFilter(
                    moment(selectedDate).format("YYYY")
                  );
                }}
              />
              <Field
                id="product_group"
                name="product_group"
                label="Product"
                options={salesSummary?.user_access_product_group_rights}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : ""
                }
                // disable={active_page.generate == "1" ? false : true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    salesSummary.filterProductGroups(newValue);
                  }
                }}
              />
              <Field
                id="filter_type"
                name="filter_type"
                label="Warehouse"
                options={annual_set_subsections}
                getOptionLabel={(option) =>
                  option.description ? option.description : ""
                }
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    salesSummary.onChangeSearch(newValue?.type);
                    salesSummary.onChangeSubsectionCode(newValue.code);
                  } else {
                    salesSummary.onChangeSearch("");
                    salesSummary.onChangeSubsectionCode("");
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CardDashComponent
              title={"Annual Sales Out"}
              value={ViewAmountFormatingDecimals(total_daily_out_amount, 2)}
              alignValue={"center"}
              fontSizeValue={18}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CardDashComponent
              title={"Warehouse/s"}
              value={salesSummary.annual_set_total_count_subsections}
              alignValue={"center"}
              fontSizeValue={18}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <AnnualSalesChart />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            ></Stack>
          </Grid>
          <Grid item xs={6} sm={6} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={"space-between"}
              alignItems={"center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <ComponentTitle
                title={
                  "Today Summary" +
                  (showbdoTable === true ? " Manila" : " Province")
                }
                subtitle={moment(new Date()).format("MMMM DD, YYYY")}
              />
              <ButtonComponent
                stx={configure.default_button}
                iconType="view2"
                type="button"
                fullWidth={true}
                children={
                  showbdoTable === true ? "Province View" : "Manila View"
                }
                click={() =>
                  showbdoTable === true
                    ? salesSummary.onClickShowBDOSalesTable()
                    : salesSummary.onClickShowProvSalesTable()
                }
              />
            </Stack>
          </Grid>
          {showprovTable === true ? (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Table
                columns={salesSummary.today_sales_columns}
                dataList={salesSummary.otherSales}
                page={salesSummary.page}
                rowsPerPage={salesSummary.rowsPerPage}
                handleChangePage={salesSummary.handleChangePage}
                handleChangeRowsPerPage={salesSummary.handleChangeRowsPerPage}
                onSelectItem={salesSummary.onSelectItem}
                id={"home_attendance"}
                localStorage={""}
                rowCount={salesSummary.otherSales?.length}
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
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Table
                columns={salesSummary.today_sales_columns}
                dataList={salesSummary.bdoSales}
                page={salesSummary.page}
                rowsPerPage={salesSummary.rowsPerPage}
                handleChangePage={salesSummary.handleChangePage}
                handleChangeRowsPerPage={salesSummary.handleChangeRowsPerPage}
                onSelectItem={salesSummary.onSelectItem}
                id={"home_attendance"}
                localStorage={""}
                rowCount={salesSummary.bdoSales?.length}
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

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title="Current Month Summary"
                subtitle={moment(new Date()).format("MMMM YYYY")}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={salesSummary.current_sales_mtd_ytd_subsections_columns}
              dataList={
                showprovTable
                  ? salesSummary.otherMTDYTDSales
                  : salesSummary.bdoMTDYTDSales
              }
              page={salesSummary.page}
              rowsPerPage={salesSummary.rowsPerPage}
              handleChangePage={salesSummary.handleChangePage}
              handleChangeRowsPerPage={salesSummary.handleChangeRowsPerPage}
              onSelectItem={salesSummary.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={
                showprovTable
                  ? salesSummary.otherMTDYTDSales?.length
                  : salesSummary.bdoMTDYTDSales?.length
              }
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
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title={
                  showMTDTable === true
                    ? "Annual MTD Summary"
                    : "Annual YTD Summary"
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="view2"
                type="button"
                fullWidth={true}
                children={showMTDTable === true ? "YTD View" : "MTD View"}
                click={
                  showMTDTable === true
                    ? salesSummary.onClickShowYTDTable
                    : salesSummary.onClickShowMTDTable
                }
              />
            </Stack>
          </Grid>
          {showMTDTable === true ? (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper
                sx={{
                  boxShadow: configure.box_shadow,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%", // adjust the max height as needed
                    overflowX: "auto",
                  }}
                  id={"tableScroll2"}
                >
                  <Tbl size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {annual_sales_mtd_ytd_subsections_columns.map(
                          (header, index) => (
                            <TableCell
                              key={index}
                              style={{
                                backgroundColor: configure.primary_table_color,
                                color: configure.primary_table_text_color,
                                textAlign: index === 0 ? "left" : "center",
                              }}
                              colSpan={header.colSpan}
                              rowSpan={index === 0 ? 2 : 1}
                            >
                              {header.label}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {annual_sales_mtd_ytd_subsections.map((value) => (
                        <TableRow hover>
                          <TableCell
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {value.subsection}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.january_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.january_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.february_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.february_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.march_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.march_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.april_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.april_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.may_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.may_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.june_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.june_current_mtd}
                          </TableCell>

                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.july_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.july_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.august_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.august_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.september_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.september_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.october_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.october_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.november_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.november_current_mtd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.december_current_mtd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.december_current_mtd}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Tbl>
                </TableContainer>
              </Paper>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper
                sx={{
                  boxShadow: configure.box_shadow,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%", // adjust the max height as needed
                    overflowX: "auto",
                  }}
                  id={"tableScroll2"}
                >
                  <Tbl size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {annual_sales_mtd_ytd_subsections_columns.map(
                          (header, index) => (
                            <TableCell
                              key={index}
                              style={{
                                backgroundColor: configure.primary_table_color,
                                color: configure.primary_table_text_color,
                                textAlign: index === 0 ? "left" : "center",
                              }}
                              colSpan={header.colSpan}
                              rowSpan={index === 0 ? 2 : 1}
                            >
                              {header.label}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {annual_sales_mtd_ytd_subsections.map((value) => (
                        <TableRow hover>
                          <TableCell
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {value.subsection}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.january_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.january_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.february_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.february_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.march_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.march_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.april_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.april_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.may_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.may_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.june_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.june_current_ytd}
                          </TableCell>

                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.july_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.july_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.august_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.august_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.september_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.september_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.october_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.october_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.november_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.november_current_ytd}
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color:
                                value.december_current_ytd < 0
                                  ? "#C83232"
                                  : "inherit",
                            }}
                          >
                            {value.december_current_ytd}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Tbl>
                </TableContainer>
              </Paper>
            </Grid>
          )}

          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle title="Annual Sales Out Summary" />
            </Stack>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              {/* <ButtonComponent
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
              /> */}
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
                dataList={salesSummary.annual_sales_out_summary}
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
