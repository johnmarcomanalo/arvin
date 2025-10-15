import React, { useState } from "react";
import { 
  Grid,
  Stack,
  useMediaQuery,
  Card,
  CardHeader,
  CardContent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Divider,
  Typography,
  Box,
  TableFooter
 } from "@mui/material";
 import { NumericFormat } from "react-number-format";
import Pie from '../Charts/Pie'

const columns = [ 
  { id: "CONTAINER", label: "Container", minWidth: 0 },
  { id: "GRPODate", label: "GRPO Date", minWidth: 80 },
  { id: "GRPO", label: "GRPO No.", minWidth: 0 },
  { id: "Dscription", label: "Item Description", minWidth: 0 },
  { id: "GRPOWh", label: "GR Warehouse", minWidth: 0 },
  { id: "DRDate", label: "DR Date", minWidth: 80 },
  { id: "CardName", label: "Card Name", minWidth: 0 },
  { id: "U_DR_NO", label: "DR No.", minWidth: 0 },
  { id: "U_SI_NO", label: "SI No.", minWidth: 0 },
  { id: "POQty", label: "PO Qty", minWidth: 0 },
  { id: "GRQty", label: "GR Qty", minWidth: 0 },
  { id: "DRQty", label: "DR Qty", minWidth: 0 },
  { id: "Quantity", label: "INV Qty", minWidth: 0 },
  { id: "CMQty", label: "CM Qty.", minWidth: 0 },
  { id: "Price", label: "Price", minWidth: 0 },
  { id: "TotalPOQty", label: "Total PO Qty", minWidth: 0 },
  { id: "datereceived", label: "Received At", minWidth: 0 },
];

 
export default function Details({
      Warehouse, 
      totalCMQty,
      totalPOQty,
      totalGRQty,
      totalDRQty,
      totalQuantity
  }) {
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
    <Grid container item spacing={2}  >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {/* <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}> */}
          <Paper>
            {/* <TableContainer sx={{ maxHeight: 440 }}> */}
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table  stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#325D79" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        fontSize:11,
                        padding: 0.5,
                        color: "white",                  // text color
                        backgroundColor: "#325D79",      // needed for sticky header
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

                <TableBody>
                  {Warehouse
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        {columns.map((column) => (
                          <TableCell 
                            key={column.id}
                            style={{ fontSize:11, padding:4}}
                          >{row[column.id]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
                {/* ✅ Add Footer Row */}
                <TableFooter>
                <TableRow sx={{ backgroundColor: "#325D79", "& td": { fontSize:11,color: "white", fontWeight: "bold" } }}>
                    {columns.map((column) => {
                      if (column.id === "U_SI_NO") {
                        return (
                          <TableCell
                            key={column.id}
                            style={{ padding:2,fontSize:11}}
                          >
                            Total
                          </TableCell>
                        );
                      }
                      if (column.id === "POQty") {
                        return (
                          <TableCell
                            key={column.id}
                            color="primary"
                            style={{ padding:2,fontSize:11}}
                          >
                              <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalPOQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                          </TableCell>
                        );
                      }
                      if (column.id === "GRQty") {
                        return (
                          <TableCell
                            key={column.id}
                            color="primary"
                             style={{ padding:2,fontSize:11}}
                          >
                             <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalGRQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />  
                          </TableCell>
                        );
                      }
                      if (column.id === "DRQty") {
                        return (
                          <TableCell
                            key={column.id}
                            color="primary"
                             style={{ padding:2,fontSize:11}}
                          >
                             <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalDRQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />  
                          </TableCell>
                        );
                      }
                      if (column.id === "Quantity") {
                        return (
                          <TableCell
                            key={column.id}
                            color="primary"
                            style={{ padding:2,fontSize:11}}
                          >
                             <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalQuantity}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />  
                          </TableCell>
                        );
                      }
                      if (column.id === "CMQty") {
                        return (
                          <TableCell
                            key={column.id}
                            color="primary"
                            style={{ padding:2,fontSize:13}}
                          >
                             <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalCMQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              />  
                          </TableCell>
                        );
                      }
                      // other cells just empty
                      return <TableCell key={column.id} style={{  padding:1}}></TableCell>;
                    })}
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            {/* <TablePagination
              rowsPerPageOptions={[15,50,100]}
              component="div"
              count={Warehouse.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            <Box py={2} borderTop={1} borderColor="divider">
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ fontSize:11 }} color="text.secondary">
                     Purchase Order Quantity
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize:15 }}  fontWeight="bold" color="primary">
                       <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalPOQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ fontSize:11 }} color="text.secondary">
                      Good Receipt Purchase Order
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize:15 }}  fontWeight="bold" color="primary">
                       <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalGRQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ fontSize:11 }} color="text.secondary">
                     Delivery Receipt Quantity
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize:15 }}  fontWeight="bold" color="primary">
                       <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalDRQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ fontSize:11 }} color="text.secondary">
                      Invoice Quantity
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize:15 }}  fontWeight="bold" color="primary">
                       <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalQuantity}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ fontSize:11 }} color="text.secondary">
                      Total CM/Return 
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize:15 }}  fontWeight="bold" color="primary">
                       <NumericFormat
                                thousandsGroupStyle="thousand"
                                value={totalCMQty}
                                decimalSeparator="."
                                displayType="text"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={true}
                                decimalScale={0}
                                fixedDecimalScale={true}
                              /> 
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid> 
      </Grid> 
    )
}