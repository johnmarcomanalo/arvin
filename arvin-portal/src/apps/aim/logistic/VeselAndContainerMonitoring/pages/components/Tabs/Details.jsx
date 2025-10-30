import React, { useState } from "react";
import { 
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Box,
  Typography,
  TableSortLabel
} from "@mui/material";
import { Field } from "redux-form";
import { NumericFormat } from "react-number-format";
import ComboBox from "components/autoComplete/AutoComplete"; 
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

  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("GRPODate");

  // Sorting handlers
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    // handle null or undefined
    if (b[orderBy] === undefined || b[orderBy] === null) return -1;
    if (a[orderBy] === undefined || a[orderBy] === null) return 1;

    // handle numeric sorting
    if (!isNaN(a[orderBy]) && !isNaN(b[orderBy])) {
      return b[orderBy] - a[orderBy];
    }

    // handle date sorting
    if (!isNaN(Date.parse(a[orderBy])) && !isNaN(Date.parse(b[orderBy]))) {
      return new Date(b[orderBy]) - new Date(a[orderBy]);
    }

    // handle string sorting
    return b[orderBy].toString().localeCompare(a[orderBy].toString());
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedRows = [...Warehouse].sort(getComparator(order, orderBy));

  const filter = [
    { 
      description:'DR' 
    },
    { 
      description:'GR' 
    },
    { 
      description:'ALL' 
    },
 ]

  return (
    <Grid container item spacing={2}>
      {/* <Grid item xs={1}>
        <Field 
            id="filter"
            name="filter"
            label="Filter"
            options={filter}
            getOptionLabel={(option) => option?.description || ""}
            value={"MANILA"}
            component={ComboBox}
            onChangeHandle={(e, newValue) => {
              
            }}
          />
      </Grid> */}
      <Grid item xs={12}>
        <Paper>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              
              {/* HEADER */}
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sortDirection={orderBy === column.id ? order : false}
                      sx={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        fontSize: 11,
                        padding: 0.5,
                        color: "white",
                        backgroundColor: "#325D79",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                        sx={{
                          color: "inherit",
                          "& .MuiTableSortLabel-icon": {
                            color: "white !important",
                          },
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {sortedRows.map((row, index) => (
                  <TableRow hover key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id} style={{ fontSize: 11, padding: 4 }}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>

              {/* FOOTER */}
              <TableFooter>
                <TableRow sx={{ backgroundColor: "#325D79", "& td": { fontSize: 11, color: "white", fontWeight: "bold" } }}>
                  {columns.map((column) => {
                    if (column.id === "U_SI_NO") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          Total
                        </TableCell>
                      );
                    }
                    if (column.id === "POQty") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          <NumericFormat value={totalPOQty} displayType="text" thousandSeparator />
                        </TableCell>
                      );
                    }
                    if (column.id === "GRQty") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          <NumericFormat value={totalGRQty} displayType="text" thousandSeparator />
                        </TableCell>
                      );
                    }
                    if (column.id === "DRQty") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          <NumericFormat value={totalDRQty} displayType="text" thousandSeparator />
                        </TableCell>
                      );
                    }
                    if (column.id === "Quantity") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          <NumericFormat value={totalQuantity} displayType="text" thousandSeparator />
                        </TableCell>
                      );
                    }
                    if (column.id === "CMQty") {
                      return (
                        <TableCell key={column.id} style={{ padding: 2, fontSize: 11 }}>
                          <NumericFormat value={totalCMQty} displayType="text" thousandSeparator />
                        </TableCell>
                      );
                    }
                    return <TableCell key={column.id} style={{ padding: 1 }}></TableCell>;
                  })}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          {/* SUMMARY BOX */}
          <Box py={2} borderTop={1} borderColor="divider">
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ fontSize: 11 }} color="text.secondary">
                    Purchase Order Quantity
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 15 }} fontWeight="bold" color="primary">
                    <NumericFormat value={totalPOQty} displayType="text" thousandSeparator />
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={2}>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ fontSize: 11 }} color="text.secondary">
                    Good Receipt Purchase Order
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 15 }} fontWeight="bold" color="primary">
                    <NumericFormat value={totalGRQty} displayType="text" thousandSeparator />
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={2}>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ fontSize: 11 }} color="text.secondary">
                    Delivery Receipt Quantity
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 15 }} fontWeight="bold" color="primary">
                    <NumericFormat value={totalDRQty} displayType="text" thousandSeparator />
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={2}>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ fontSize: 11 }} color="text.secondary">
                    Invoice Quantity
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 15 }} fontWeight="bold" color="primary">
                    <NumericFormat value={totalQuantity} displayType="text" thousandSeparator />
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="body2" sx={{ fontSize: 11 }} color="text.secondary">
                    Total CM/Return
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 15 }} fontWeight="bold" color="primary">
                    <NumericFormat value={totalCMQty} displayType="text" thousandSeparator />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
