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
export default function AnnualSalesRanking(props) {
  const { ...salesDailyOutComponentAnnualSettingSale } =
    SalesDailyOutComponentAnnualSalesRankingHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const target_point = parseInt(
    salesDailyOutComponentAnnualSettingSale?.target_point
  );
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
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
                  {salesDailyOutComponentAnnualSettingSale.dataList.map(
                    (data, index) => {
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
                              {data.code}
                            </TableCell>
                            <TableCell align="left">
                              {data.ranker_code}
                            </TableCell>
                            <TableCell align="left">
                              <div
                                style={{
                                  width: "100%",
                                  height: 15,
                                  backgroundColor: "#e2e2e2",
                                  borderRadius: 12,
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  flexDirection: "row",
                                }}
                              >
                                {Array.isArray(point_details) &&
                                  point_details.map((point, index) => {
                                    const percentage =
                                      (point?.value / target_point) * 100;
                                    const monthColor =
                                      configure.monthly_colors.find(
                                        (color) =>
                                          color.name === point.description
                                      );
                                    const isVisible = percentage > 0;

                                    return (
                                      <div
                                        key={index}
                                        style={{
                                          width: percentage + "%",
                                          height: 15,
                                          display: isVisible ? "block" : "none",
                                          backgroundColor: isVisible
                                            ? monthColor
                                              ? monthColor.hex
                                              : "#0198ff"
                                            : "none",
                                          borderTopLeftRadius:
                                            index === 0 ? 12 : null,
                                          borderBottomLeftRadius:
                                            index === 0 ? 12 : null,
                                          borderTopRightRadius:
                                            index === point_details.length - 1
                                              ? 12
                                              : null,
                                          borderBottomRightRadius:
                                            index === point_details.length - 1
                                              ? 12
                                              : null,
                                          color: "white",
                                          fontSize: 10,
                                          paddingLeft: 5,
                                        }}
                                      />
                                    );
                                  })}
                                {/* <div
                                  style={{
                                    width: "100%",
                                    height: 15,
                                    backgroundColor: "#e2e2e2",
                                    borderTopRightRadius: 12,
                                    borderBottomRightRadius: 12,
                                    fontSize: 10,
                                    paddingLeft: 5,
                                  }}
                                /> */}
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
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <Table
            columns={salesDailyOutComponentAnnualSettingSale.columns}
            dataList={salesDailyOutComponentAnnualSettingSale.dataList}
            page={salesDailyOutComponentAnnualSettingSale.page}
            rowsPerPage={salesDailyOutComponentAnnualSettingSale.rowsPerPage}
            handleChangePage={
              salesDailyOutComponentAnnualSettingSale.handleChangePage
            }
            handleChangeRowsPerPage={
              salesDailyOutComponentAnnualSettingSale.handleChangeRowsPerPage
            }
            onSelectItem={salesDailyOutComponentAnnualSettingSale.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesDailyOutComponentAnnualSettingSale.dataListCount}
            actionShow={false}
            paginationShow={false}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      salesDailyOutComponentAnnualSettingSale.onDeleteDeduction(
                        row
                      )
                    }
                    style={{
                      color: "#009197",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              );
            }}
          /> */}
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
