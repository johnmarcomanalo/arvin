import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
// import Table from "../../../../../components/table/Table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import LaunchIcon from "@mui/icons-material/Launch";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import configure from "../../../../configure/configure.json";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../hooks/SalesDailyOutComponentAnnualSalesRankingHooks";
import Modal from "../../../../../components/modal/Modal";
import AddAnnualSettingSale from "./components/GenerateAnnualSalesRanking";
import Page from "../../../../../components/pagination/Pagination";
import AddAnnualSalesRanker from "./components/AddAnnualSalesRanker";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import UpdateMonthlyRank from "./components/UpdateMonthlyRank";
import ViewSelectedRanker from "./components/ViewSelectedRanker";
import TruckGIF from "../../../../../media/icons/truck.gif";
import Road from "../../../../../media/backgrounds/road.jpg";
import FinishLine from "../../../../../media/icons/finish line.gif";
import Medal from "../../../../../media/icons/modal.gif";
export default function AnnualSalesRanking(props) {
  const { ...salesDailyOutComponentAnnualSettingSale } =
    SalesDailyOutComponentAnnualSalesRankingHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const target_point = parseInt(
    salesDailyOutComponentAnnualSettingSale?.target_point
  );
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);

  const calculateCurrentPoint = (point_details) => {
    let current_point = 0;
    if (Array.isArray(point_details)) {
      point_details.forEach((point) => {
        current_point += parseInt(point.value, 10);
      });
    }
    return current_point;
  };

  const sortedDataList = salesDailyOutComponentAnnualSettingSale.dataList
    .map((data) => ({
      ...data,
      current_point: calculateCurrentPoint(data.details),
    }))
    .sort((a, b) => b.current_point - a.current_point);
  return (
    <React.Fragment>
      <Modal
        open={salesDailyOutComponentAnnualSettingSale?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Sales Ranking"}
        size={"xs"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSale.onClickCloseAddModal
        }
      >
        <AddAnnualSettingSale />
      </Modal>
      <Modal
        open={salesDailyOutComponentAnnualSettingSale?.addModal2}
        fullScreen={matches ? false : true}
        title={"Annual Sales Ranking"}
        size={"xs"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSale.onClickCloseAddModal2
        }
      >
        <AddAnnualSalesRanker />
      </Modal>
      <Modal
        open={salesDailyOutComponentAnnualSettingSale?.addModal3}
        fullScreen={matches ? false : true}
        title={"Update Ranking"}
        size={"xs"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSale.onClickCloseAddModal3
        }
      >
        <UpdateMonthlyRank />
      </Modal>

      <Modal
        open={salesDailyOutComponentAnnualSettingSale?.addModal4}
        fullScreen={matches ? false : true}
        title={"View Ranking Details"}
        size={"sm"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSale.onClickCloseAddModal4
        }
      >
        <ViewSelectedRanker />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
            flexDirection={"row"}
            spacing={2}
          >
            <ButtonComponent
              stx={configure.default_button}
              iconType="generate"
              type="button"
              fullWidth={true}
              children={"Generate Ranking"}
              click={
                salesDailyOutComponentAnnualSettingSale.onClickOpenAddModal
              }
            />
            {salesDailyOutComponentAnnualSettingSale.selected_code ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Add Ranker"}
                click={
                  salesDailyOutComponentAnnualSettingSale.onClickOpenAddModal2
                }
              />
            ) : null}
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            flexDirection={"row"}
            spacing={2}
          >
            <SearchField
              value={salesDailyOutComponentAnnualSettingSale.search}
              onChange={salesDailyOutComponentAnnualSettingSale.onChangeSearch}
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
              page={salesDailyOutComponentAnnualSettingSale?.page}
              limit={salesDailyOutComponentAnnualSettingSale?.dataListCount}
              status={""}
              onHandleChange={
                salesDailyOutComponentAnnualSettingSale.handleChangePage
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper sx={{ boxShadow: configure.box_shadow }}>
            <TableContainer
              sx={{
                maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
              id={"tableScroll2"}
            >
              <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Action
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Ranking
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Ranker
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "center",
                      }}
                    >
                      Point Details
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Current Point
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedDataList.map((data, index) => {
                    let current_point = 0;
                    try {
                      let point_details = data?.details;
                      return (
                        <TableRow
                          key={data.code}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell>
                            <Tooltip title="View">
                              <LaunchIcon
                                onClick={() =>
                                  salesDailyOutComponentAnnualSettingSale.onClickSelectedDataList(
                                    data,
                                    "addModal4"
                                  )
                                }
                                style={{
                                  color: "#009197",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Update">
                              <UpgradeIcon
                                onClick={() =>
                                  salesDailyOutComponentAnnualSettingSale.onClickSelectedDataList(
                                    data,
                                    "addModal3"
                                  )
                                }
                                style={{
                                  color: "#009197",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell component="th" scope="data">
                            {index + 1}
                          </TableCell>
                          <TableCell align="left">{data.description}</TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                borderRadius: 12,
                                display: "flex",
                                justifyContent: "flex-start",
                                flexDirection: "row",
                                position: "relative",
                                backgroundImage: `url(${Road})`, // Corrected line
                                backgroundSize: "contain", // Ensure the image covers the div
                                backgroundRepeat: "repeat", // Prevent the image from repeating
                              }}
                            >
                              {Array.isArray(point_details) &&
                                point_details.map((point, index) => {
                                  const percentage =
                                    (point?.value / target_point) * 100;
                                  const isVisible = percentage > 0;
                                  current_point += parseInt(point.value);
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        width: percentage + "%",
                                        display: isVisible ? "block" : "none",
                                        paddingLeft: 5,
                                        position: "relative",
                                      }}
                                    >
                                      <p style={{ visibility: "hidden" }}>
                                        Null
                                      </p>
                                      {/* {index === point_details.length - 1 &&
                                        (current_point > target_point ? (
                                          <img
                                            src={TruckGIF}
                                            alt="Truck"
                                            style={{
                                              width: "auto",
                                              height: 25,
                                              position: "absolute",
                                              top: 8,
                                              right: -30,
                                            }}
                                          />
                                        ) : null)} */}

                                      {index === point_details.length - 1 &&
                                        parseInt(current_point) <
                                          parseInt(target_point) && (
                                          <img
                                            src={TruckGIF}
                                            alt="Truck"
                                            style={{
                                              width: "auto",
                                              height: 55,
                                              position: "absolute",
                                              top: 0,
                                              right: -30,
                                              filter:
                                                "brightness(0.8) contrast(1.3) saturate(4.5) ",
                                            }}
                                          />
                                        )}
                                    </div>
                                  );
                                })}
                              {current_point == target_point ? (
                                <img
                                  src={Medal}
                                  alt="Finish Line"
                                  style={{
                                    width: "auto",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                  }}
                                />
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {data.current_point}
                          </TableCell>
                        </TableRow>
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
