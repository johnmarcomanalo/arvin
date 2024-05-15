import {
  Grid,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@mui/material";
import * as React from "react";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../../hooks/SalesDailyOutComponentAnnualSalesRankingHooks";
import configure from "../../../../../configure/configure.json";
export default function ViewSelectedRanker(props) {
  const { ...salesDailyOutComponentAnnualSalesRanking } =
    SalesDailyOutComponentAnnualSalesRankingHooks(props);
  const selectedDataList =
    salesDailyOutComponentAnnualSalesRanking.selectedDataList;
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
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
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                        textAlign: "left",
                      }}
                    >
                      Points
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDataList?.details.map((data, index) => {
                    try {
                      return (
                        <TableRow
                          key={data.code}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell align="left">{data.description}</TableCell>
                          <TableCell align="left">{data.placement}</TableCell>
                          <TableCell align="left">{data.value}</TableCell>
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
