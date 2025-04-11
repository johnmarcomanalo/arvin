import LaunchIcon from "@mui/icons-material/Launch";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import * as React from "react";
import ButtonComponent from "components/button/Button";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import Road from "../../../../../media/backgrounds/road.jpg";
import Medal from "../../../../../media/icons/modal.gif";
import TruckGIF from "../../../../../media/icons/truck.gif";
import configure from "apps/configure/configure.json";
import SalesLeaderboardHooks from "../hooks/SalesLeaderboardHooks";
import AddRanker from "./components/AddRanker";
import GenerateLeaderboard from "./components/GenerateLeaderboard";
import UpdateRanker from "./components/UpdateRanker";
import ViewRanker from "./components/ViewRanker";
export default function SalesLeaderboard(props) {
  const { ...salesLeaderboard } = SalesLeaderboardHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const target_point = parseInt(salesLeaderboard?.target_point);
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

  const sortedDataList = (salesLeaderboard?.dataList ?? [])
    .map((data) => ({
      ...data,
      current_point: calculateCurrentPoint(data.details),
    }))
    .sort((a, b) => b.current_point - a.current_point);
  return (
    <React.Fragment>
      <Modal
        open={salesLeaderboard?.addModal}
        fullScreen={matches ? false : true}
        title={"Generate Leaderboard"}
        size={"xs"}
        action={undefined}
        handleClose={salesLeaderboard.onClickCloseAddModal}
      >
        <GenerateLeaderboard />
      </Modal>
      <Modal
        open={salesLeaderboard?.addModal2}
        fullScreen={matches ? false : true}
        title={"Add Ranker"}
        size={"xs"}
        action={undefined}
        handleClose={salesLeaderboard.onClickCloseAddModal2}
      >
        <AddRanker />
      </Modal>
      <Modal
        open={salesLeaderboard?.addModal3}
        fullScreen={matches ? false : true}
        title={"Update Ranking"}
        size={"xs"}
        action={undefined}
        handleClose={salesLeaderboard.onClickCloseAddModal3}
      >
        <UpdateRanker />
      </Modal>

      <Modal
        open={salesLeaderboard?.addModal4}
        fullScreen={matches ? false : true}
        title={"View Ranking Details"}
        size={"sm"}
        action={undefined}
        handleClose={salesLeaderboard.onClickCloseAddModal4}
      >
        <ViewRanker />
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
              children={"Generate Leaderboard"}
              click={salesLeaderboard.onClickOpenAddModal}
            />
            {salesLeaderboard.selected_code ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Add Ranker"}
                click={salesLeaderboard.onClickOpenAddModal2}
              />
            ) : null}
            {salesLeaderboard.selected_code ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="refresh"
                type="button"
                fullWidth={true}
                children={"Refresh Ranking"}
                click={salesLeaderboard.onClickRefreshRanking}
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
              value={salesLeaderboard.search}
              onChange={salesLeaderboard.onChangeSearch}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Filter</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={salesLeaderboard.filterQuery}
                label="Filter"
                onChange={salesLeaderboard.onChangeFilter}
              >
                <MenuItem value="All">All</MenuItem>
                {configure.months.map((month) => {
                  let code = moment(month.description, "MMMM").format("MM");
                  return <MenuItem value={code}>{month.description}</MenuItem>;
                })}
              </Select>
            </FormControl>
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
              page={salesLeaderboard?.page}
              limit={salesLeaderboard?.dataListCount}
              status={""}
              onHandleChange={salesLeaderboard.handleChangePage}
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
                        textAlign: "left",
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
                          }}
                        >
                          <TableCell>
                            <Tooltip title="View">
                              <LaunchIcon
                                onClick={() =>
                                  salesLeaderboard.onClickSelectedDataList(
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
                                  salesLeaderboard.onClickSelectedDataList(
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
                                minHeight: 50,
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
                              {current_point >= target_point ? (
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
                          <TableCell align="left">{current_point}</TableCell>
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
