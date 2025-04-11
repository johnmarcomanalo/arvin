import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import SalesSummaryHooks from "../hooks/SalesSummaryHooks";
import WarehouseAnnualSalesChart from "./charts/WarehouseAnnualSalesChart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import CardDashComponent from "components/card/CardDashComponent";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import configure from "apps/configure/configure.json";
export default function SelectedSalesSummary(props) {
  const { ...salesSummary } = SalesSummaryHooks(props);
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  const showTableCards = salesSummary.showTableCards;
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Grid container spacing={2}>
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
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <WarehouseAnnualSalesChart />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
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
                      Month
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Placement
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>February</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>February</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>February</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>February</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>February</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>January</TableCell>
                    <TableCell>1st Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>December</TableCell>
                    <TableCell>2nd Place</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
