import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery, TableRow, Paper, TableCell,TableBody,TableContainer,TableHead,Table as Tbl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputFieldButton from "components/inputFIeld/InputFieldButton";
import InputMonthYearPicker from "components/inputFIeld/InputMonthYearPicker";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import ComponentTable from "components/table/Table";
import InputYearPicker from "components/inputFIeld/InputYearPicker"; 
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ClientSalesWeekHooks from "../hooks/ClientSalesSummaryHooks";
import FilterClientSalesTracker from "./components/FilterClientSalesTracker";
import ComponentTitle from "components/componentTitle/componentTitle";
const formName = "ClientSalesSummary";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
const currentMonth = new Date().getMonth() + 1;
let ClientSalesSummary = (props) => {
  const { ...salesTracker } = ClientSalesWeekHooks(props);
  // const { ...salesTracker } = ClientSalesMonthHooks(props);
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
          <AccountList onClickSelect={salesTracker.onChangeFilterBDO} />
        </Modal>
        <Grid container spacing={2}> 
         <Grid  item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "end"}
            alignItems={matches ? "space-between" : "flex-end"}
            flexDirection={matches ? "row" : "column"} 
          > 
         <Grid container item xs={12} sm={12} md={12} lg={6}>
          <SearchField
              value={salesTracker.search}
              onChange={salesTracker.onChangeSearch}
              textHidden={false}
            /> 
         </Grid>
            <Grid container spacing={1}  item xs={12} sm={12} md={12} lg={6}>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <Field
                  name="sales_date"
                  label="Date"
                  required={true}
                  component={InputMonthYearPicker}
                  placeholder="Date" 
                  disablePast={false}
                  disableFuture={true}
                  disableSunday={true}
                  showText={true}
                  defaultValue={new Date()}
                  onChange={(date) => {
                    salesTracker.filterMonthAndYear(
                      moment(date).format("YYYY"),
                      moment(date).format("MM")
                    );
                  }}
                />
                
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <Field
                  key={props.refresh}
                  id="product_group"
                  name="product_group"
                  required={true}
                  value={"INDUSTRIAL SALT"}                  
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
            </Grid>
          </Stack>
         </Grid>

         <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >  
              <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Stack
                    direction="row"
                    justifyContent={matches ? "flex-start" : "center"}
                    alignItems={matches ? "flex-start" : "center"}
                    flexDirection={matches ? "row" : "column"}
                  >
                    <ComponentTitle
                      title="Weekly Sales Summary"
                      subtitle={moment(new Date()).format("MMMM YYYY")}
                    />
                  </Stack>
                </Grid> 
                <Page
                  page={salesTracker?.page}
                  limit={salesTracker?.dataListCount}
                  onHandleChange={salesTracker.handleChangePage}
                />
            </Stack>
          </Grid>
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
                       <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              
                            }} 
                            rowSpan={2}
                          >
                           Client
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              
                            }}  
                            rowSpan={2}
                          >
                           Monthly Quota
                        </TableCell> 
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                            colSpan={2}
                          >
                           Week 1
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                            colSpan={2}
                          >
                           Week 2
                        </TableCell> 
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                            colSpan={2}
                          >
                           Week 3
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                            colSpan={2}
                          >
                           Week 4
                        </TableCell>   
                    </TableRow>
                    <TableRow>  
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Sales Out
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Percentage
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color, 
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Sales Out
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Percentage
                        </TableCell> 
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Sales Out
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Percentage
                        </TableCell> 
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Sales Out
                        </TableCell>
                        <TableCell 
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              borderLeft: "1px solid white", 
                              textAlign:"center",
                            }} 
                          >
                           Percentage
                        </TableCell>  
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesTracker?.dataList?.length > 0 ? (
                      salesTracker.dataList.map((value, key) => {
                        try {
                          return (
                            <TableRow key={key} hover>
                              {/* Client */}
                              <TableCell style={{ textAlign: "left" }}>
                                {value.sales_daily_out_settings_client_groups_description}
                              </TableCell>

                              {/* Monthly Quota */}
                              <TableCell style={{ textAlign: "left" }}>
                                {value.month_sales_daily_qouta}
                              </TableCell>

                              {/* Week 1 */}
                              <TableCell style={{ textAlign: "center" }}>
                                {value["1-7"]}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: value.week_one_percentage < 25 ? "#C83232" : "#009933",
                                }}
                              >
                                {value.week_one_percentage}
                              </TableCell>

                              {/* Week 2 */}
                              <TableCell style={{ textAlign: "center" }}>
                                {value["8-14"]}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: value.week_two_percentage < 50 ? "#C83232" : "#009933",
                                }}
                              >
                                {value.week_two_percentage}
                              </TableCell>

                              {/* Week 3 */}
                              <TableCell style={{ textAlign: "center" }}>
                                {value["15-21"]}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: value.week_three_percentage < 75 ? "#C83232" : "#009933",
                                }}
                              >
                                {value.week_three_percentage}
                              </TableCell>

                              {/* Week 4 */}
                              <TableCell style={{ textAlign: "center" }}>
                                {value["22-30/31"]}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: value.week_four_percentage < 100 ? "#C83232" : "#009933",
                                }}
                              >
                                {value.week_four_percentage}
                              </TableCell>
                            </TableRow>
                          );
                        } catch (error) {
                          console.log(error);
                        }
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody> 
                </Tbl>
              </TableContainer>
            </Paper>
          </Grid>

        {/* month dashboard */}
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
            >
              <ComponentTitle
                title={"Monthly Sales Summary"}
                subtitle={moment(salesTracker.year).format("YYYY")}
              />
            </Stack>
          </Grid>        
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
                        {salesTracker.columns_month.map(
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
                      {salesTracker?.dataList2 && salesTracker.dataList2.length > 0 ? (
                        salesTracker.dataList2.map((value, index) => {
                          try {
                            return (
                              <TableRow key={index} hover>
                                <TableCell style={{ textAlign: "left" }}>
                                  {value.sales_daily_out_settings_client_groups_description}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center",
                                    color: 1 > currentMonth
                                          ? "inherit" // no color for upcoming months
                                          : value.mtd_january_final_percentage < 0
                                          ? "#C83232"
                                          : "#009933", 
                                  }}
                                >
                                  {value.january_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center",
                                    color: 2 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_february_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.february_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 3 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_march_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.march_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 4 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_april_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.april_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 5 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_may_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.may_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 6 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_june_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.june_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center",
                                    color: 7 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_july_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.july_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 8 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_august_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.august_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 9 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_september_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.september_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 10 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_october_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.october_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 11 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_november_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.november_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center", 
                                    color: 12 > currentMonth
                                    ? "inherit" // no color for upcoming months
                                    : value.mtd_december_final_percentage < 0
                                    ? "#C83232"
                                    : "#009933", 
                                  }}
                                >
                                  {value.december_total_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center",
                                    color: value.annual_quota < 0 ? "#C83232" : "inherit",
                                  }}
                                >
                                  {value.annual_quota}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "center",
                                    color: value.year_sales_daily_out < 0 ? "#C83232" : "inherit",
                                  }}
                                >
                                  {value.year_sales_daily_out}
                                </TableCell>

                                <TableCell
                                  style={{
                                    textAlign: "right",
                                    color: value.annual_quota_percentage < 100 ? "#C83232" : "#009933",
                                  }}
                                >
                                  {value.annual_quota_percentage}%
                                </TableCell>
                              </TableRow>
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={16} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>

                  </Tbl>
                </TableContainer>
              </Paper>
          </Grid>

        </Grid> 
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ClientSalesSummary);
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
