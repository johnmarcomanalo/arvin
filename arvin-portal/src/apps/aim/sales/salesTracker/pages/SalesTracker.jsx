import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import IsoIcon from "@mui/icons-material/Iso";
import PercentIcon from "@mui/icons-material/Percent";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OutputOutlinedIcon from "@mui/icons-material/OutputOutlined";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import CardComponent from "../../../../../components/card/CardComponent";
import InputMonthYearPicker from "../../../../../components/inputFIeld/InputMonthYearPicker";
import Modal from "../../../../../components/modal/Modal";
import Page from "../../../../../components/pagination/Pagination";
import ExposureOutlinedIcon from "@mui/icons-material/ExposureOutlined";
import ComponentTable from "../../../../../components/table/Table";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import configure from "../../../../configure/configure.json";
import SalesTrackerHooks from "../hooks/SalesTrackerHooks";
import AddSales from "./components/AddSales";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import { ViewAmountFormatingDecimals } from "../../../../../utils/AccountingUtils";
import FilterSales from "./components/FilterSales";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import CardWithTitleValueIcon from "../../../../../components/card/CardWithTitleValueIcon";
import CardGradient from "../../../../../components/card/CardGradient";
const formName = "SalesTracker";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
let SalesTracker = (props) => {
  const { ...salesTracker } = SalesTrackerHooks(props);
  const report_data = salesTracker.report_data;
  const present_mtd_data = salesTracker.present_mtd_data;
  const previous_mtd_data = salesTracker.previous_mtd_data;
  const final_ytd_data = salesTracker.final_ytd_data;
  const dateFilter = salesTracker.dateFilter;
  const selected_subsection = salesTracker?.selected_subsection;
  const active_page = salesTracker?.active_page;
  const state = salesTracker?.state;
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const [open, setOpen] = React.useState(false);
  const today_data = salesTracker?.today_data;
  const handleClickOpen = async () => {
    await setOpen(true);
    await alert("Press 'esc' to exit view mode");
  };
  const handleClose = () => {
    setOpen(false);
  };
  const product_group_unit_of_measure_type =
    typeof salesTracker.product_group_unit_of_measure_type !== "undefined"
      ? salesTracker.product_group_unit_of_measure_type
      : "unit";

  const else_color = (first, second) => {
    return first < second;
  };
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
      <Modal
        open={salesTracker?.filterModal}
        fullScreen={matches ? false : true}
        title={"Filter Sales Tracker"}
        size={"xs"}
        action={undefined}
        handleClose={salesTracker.onClickCloseFilterModal}
      >
        <FilterSales
          user_access_organization_rights={
            salesTracker.user_access_organization_rights
          }
          onChangeFilter={salesTracker.filterSubComponents}
          onClose={salesTracker.onClickCloseFilterModal}
        />
      </Modal>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}></Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
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
                  subtitle={
                    "% MTD (" +
                    moment(dateFilter).format("MMMM").toUpperCase() +
                    ")"
                  }
                  value={
                    typeof present_mtd_data?.mtdFinal !== "undefined"
                      ? present_mtd_data?.mtdFinal
                      : 0
                  }
                  fontSizeValue={30}
                  subvalue={"this is sub value"}
                  enableSubHeaderVariant={false}
                  changeColorValue={true}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
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
                  subtitle={
                    "FINAL YTD (" + moment(dateFilter).format("YYYY") + ")"
                  }
                  value={
                    typeof final_ytd_data !== "undefined"
                      ? parseFloat(final_ytd_data).toFixed(2)
                      : 0
                  }
                  fontSizeValue={30}
                  subvalue={"this is sub value"}
                  changeColorValue={true}
                  enableSubHeaderVariant={false}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
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
                  heightLimit={false}
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
                  extraLayer={() => {
                    return (
                      <TableRow>
                        <TableCell
                          style={{
                            backgroundColor: configure.primary_table_color,
                            color: configure.primary_table_text_color,
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          TOTAL
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: 600,
                            color:
                              parseFloat(salesTracker.monthly_sales_target) < 0
                                ? "#C83232"
                                : "inherit",
                          }}
                        >
                          {ViewAmountFormatingDecimals(
                            salesTracker.monthly_sales_target,
                            2
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: 600,
                            color:
                              parseFloat(report_data?.total_daily_out_amount) <
                              0
                                ? "#C83232"
                                : "inherit",
                          }}
                        >
                          {ViewAmountFormatingDecimals(
                            report_data?.total_daily_out_amount,
                            2
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: 600,
                            color:
                              parseFloat(
                                report_data?.total_status_daily_target_amount
                              ) < 0
                                ? "#C83232"
                                : "inherit",
                          }}
                        >
                          {ViewAmountFormatingDecimals(
                            report_data?.total_status_daily_target_amount,
                            2
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: 600,
                            color:
                              parseFloat(present_mtd_data?.mtdFinal) < 0
                                ? "#C83232"
                                : "inherit",
                          }}
                        >
                          {ViewAmountFormatingDecimals(
                            present_mtd_data?.mtdFinal,
                            2
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={4}></Grid>
        </Grid>
      </Dialog>

      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle
            title={"Sales Tracker"}
            subtitle={
              (state?.active_subsections == null
                ? selected_subsection.description
                : state?.active_subsections) +
              (salesTracker.filterProductGroup == ""
                ? ""
                : " - " + salesTracker.filterProductGroup)
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
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
            unit={product_group_unit_of_measure_type}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
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
            unit={product_group_unit_of_measure_type}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
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
            unit={product_group_unit_of_measure_type}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
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
              typeof final_ytd_data !== "undefined"
                ? parseFloat(final_ytd_data).toFixed(2)
                : 0
            }
            fontSizeValue={18}
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
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
            unit={product_group_unit_of_measure_type}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
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
            unit={product_group_unit_of_measure_type}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
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
        <Grid item xs={12} sm={12} md={2}>
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
            subtitle={"% MTD"}
            value={
              typeof present_mtd_data?.mtdFinal !== "undefined"
                ? present_mtd_data?.mtdFinal
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
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
            subtitle={"% PREV MTD"}
            value={
              typeof previous_mtd_data?.mtdFinal !== "undefined"
                ? parseFloat(previous_mtd_data?.mtdFinal).toFixed(2)
                : 0
            }
            subvalue={"this is sub value"}
            changeColorValue={true}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
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
      </Grid> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle
            title={"Sales Tracker"}
            subtitle={
              (state?.active_subsections == null
                ? selected_subsection.description
                : state?.active_subsections) +
              (salesTracker.filterProductGroup == ""
                ? ""
                : " - " + salesTracker.filterProductGroup)
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CardGradient
            child={
              <>
                <CardHeader
                  title={
                    moment(salesTracker.filterQuery).format("YYYY") +
                    " Annual Performance Review"
                  }
                  titleTypographyProps={{
                    sx: {
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: configure.primary_color,
                    }, // Custom title styles
                  }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      {" "}
                      <CardWithTitleValueIcon
                        icon={
                          <FlagCircleOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"ANNUAL TARGET"}
                        value={salesTracker.annual_sales_target}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <CardWithTitleValueIcon
                        icon={
                          <DateRangeOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"YTD QUOTA"}
                        value={salesTracker.ytdTotalDailyQoutaAmount}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                        changeColorValue={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      {" "}
                      <CardWithTitleValueIcon
                        icon={
                          <OutputOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"YTD SALES OUTPUT"}
                        value={salesTracker.ytdTotalDailyOutAmount}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                        changeColorValue={true}
                        else_color={else_color(
                          parseInt(salesTracker?.ytdTotalDailyOutAmount),
                          parseInt(salesTracker?.ytdTotalDailyQoutaAmount)
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      {" "}
                      <CardWithTitleValueIcon
                        icon={
                          <PercentIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"FINAL YTD"}
                        value={final_ytd_data}
                        subvalue={"this is sub value"}
                        changeColorValue={true}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CardGradient
            child={
              <>
                <CardHeader
                  title={
                    moment(salesTracker.filterQuery).format("MMMM") +
                    " Performance Review"
                  }
                  titleTypographyProps={{
                    sx: {
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: configure.primary_color,
                    }, // Custom title styles
                  }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {" "}
                      <CardWithTitleValueIcon
                        icon={
                          <FlagCircleOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"MONTHLY TARGET"}
                        value={salesTracker.monthly_sales_target}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {" "}
                      <CardWithTitleValueIcon
                        icon={
                          <DateRangeOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"MTD QUOTA"}
                        value={report_data?.total_target_daily_quota_amount}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                        changeColorValue={true}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <CardWithTitleValueIcon
                        icon={
                          <OutputOutlinedIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"MTD SALES OUTPUT"}
                        value={report_data?.total_daily_out_amount}
                        subvalue={"this is sub value"}
                        unit={product_group_unit_of_measure_type}
                        changeColorValue={true}
                        else_color={else_color(
                          parseInt(report_data?.total_daily_out_amount),
                          parseInt(report_data?.total_target_daily_quota_amount)
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <CardWithTitleValueIcon
                        icon={
                          <PercentIcon
                            sx={{
                              color: configure.tertiary_color,
                            }}
                          />
                        }
                        icon_color={configure.primary_color}
                        icon_bg_color={"white"}
                        title={"Year"}
                        subtitle={"FINAL MTD"}
                        value={present_mtd_data?.mtdFinal}
                        subvalue={"this is sub value"}
                        changeColorValue={true}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card sx={{ boxShadow: configure.box_shadow }}>
            <CardHeader
              title={
                moment(today_data?.sales_date).format("MMMM Do") +
                " Performance Review"
              }
              titleTypographyProps={{
                sx: {
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: configure.primary_color,
                }, // Custom title styles
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  {" "}
                  <CardWithTitleValueIcon
                    icon={
                      <FlagCircleOutlinedIcon
                        sx={{
                          color: configure.tertiary_color,
                        }}
                      />
                    }
                    icon_color={configure.primary_color}
                    icon_bg_color={"white"}
                    title={"Year"}
                    subtitle={"DAILY TARGET"}
                    value={salesTracker.daily_sales_target}
                    subvalue={"this is sub value"}
                    unit={product_group_unit_of_measure_type}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <CardWithTitleValueIcon
                    icon={
                      <OutputOutlinedIcon
                        sx={{
                          color: configure.tertiary_color,
                        }}
                      />
                    }
                    icon_color={configure.primary_color}
                    icon_bg_color={"white"}
                    title={"Year"}
                    subtitle={"TODAY SALES OUTPUT"}
                    value={today_data?.sales_daily_out}
                    subvalue={"this is sub value"}
                    unit={product_group_unit_of_measure_type}
                    changeColorValue={true}
                    else_color={else_color(
                      parseInt(today_data?.sales_daily_out),
                      parseInt(salesTracker?.daily_sales_target)
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <CardWithTitleValueIcon
                    icon={
                      <PercentIcon
                        sx={{
                          color: configure.tertiary_color,
                        }}
                      />
                    }
                    icon_color={configure.primary_color}
                    icon_bg_color={"white"}
                    title={"Year"}
                    rf
                    subtitle={"FINAL DTD"}
                    value={today_data?.daily_sales_target_percentage}
                    subvalue={"this is sub value"}
                    changeColorValue={true}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card sx={{ boxShadow: configure.box_shadow }}>
            <CardHeader
              title={
                moment(salesTracker.filterQuery)
                  .subtract(1, "months")
                  .format("MMMM") + " Performance Review"
              }
              titleTypographyProps={{
                sx: {
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: configure.primary_color,
                }, // Custom title styles
              }}
              subheaderTypographyProps={{
                sx: { fontSize: "1rem", color: configure.secondary_color }, // Custom subheader styles
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <CardWithTitleValueIcon
                    icon={
                      <ExposureOutlinedIcon
                        sx={{
                          color: configure.tertiary_color,
                        }}
                      />
                    }
                    icon_color={configure.primary_color}
                    icon_bg_color={"white"}
                    title={"Year"}
                    subtitle={"LOSS/EXCESS (PREV MO):"}
                    value={previous_mtd_data?.mtdTotalStatusDailyTarget}
                    subvalue={"this is sub value"}
                    unit={product_group_unit_of_measure_type}
                    changeColorValue={true}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <CardWithTitleValueIcon
                    icon={
                      <PercentIcon
                        sx={{
                          color: configure.tertiary_color,
                        }}
                      />
                    }
                    icon_color={configure.primary_color}
                    icon_bg_color={"white"}
                    title={"Year"}
                    subtitle={"PREV MTD"}
                    value={previous_mtd_data?.mtdFinal}
                    subvalue={"this is sub value"}
                    changeColorValue={true}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
              sx={{ marginTop: 2 }}
            >
              {/* <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Add Today's Sale"}
                click={salesTracker.onClickOpenAddModal}
              /> */}
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <form onSubmit={props.handleSubmit}>
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
              <Field
                id="subcomponents"
                name="subcomponents"
                label="Warehouses"
                options={salesTracker?.user_access_organization_rights}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : ""
                }
                // disable={active_page.generate == "1" ? false : true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    salesTracker.filterSubComponents(newValue);
                  }
                }}
              />
              <Field
                id="product_group"
                name="product_group"
                label="Product"
                options={salesTracker?.user_access_product_group_rights}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : ""
                }
                // disable={active_page.generate == "1" ? false : true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    salesTracker.filterProductGroups(newValue);
                  }
                }}
              />
            </Stack>
          </form>
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={4}>
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
              children={"VIEW FULLSCREEN"}
              click={handleClickOpen}
            />
            {/* <ButtonComponent
                  stx={configure.default_button}
                  iconType="generate"
                  type="button"
                  fullWidth={true}
                  children={"Generate"}
                  click={salesTracker.onClickOpenFilterModal}
                /> */}
          </Stack>
        </Grid>
        {/* <Grid item xs={6} sm={6} md={4} lg={4}>
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
              limitPerPage={salesTracker?.rowsPerPage}
              status={""}
              onHandleChange={salesTracker.handleChangePage}
            />
          </Stack>
        </Grid> */}
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
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(SalesTracker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const sales_date = selector(state, "sales_date");

  return {
    sales_date,
  };
}, {})(ReduxFormComponent);
