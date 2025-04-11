import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import * as React from "react";
import configure from "apps/configure/configure.json";
import SalesLeaderboardHooks from "../../hooks/SalesLeaderboardHooks";
export default function ViewRanker(props) {
  const { ...salesLeaderboard } = SalesLeaderboardHooks(props);
  const selectedDataList = salesLeaderboard.selectedDataList;
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <TextField
            size="small"
            label="Ranker"
            fullWidth
            value={selectedDataList?.description}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
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
