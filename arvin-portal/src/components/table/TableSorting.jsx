import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LaunchIcon from "@mui/icons-material/Launch";
import { Box, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import configure from "../../apps/configure/configure.json";
const TableSorting = (props) => {
  const {
    columns,
    dataList = [],
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    onSelectItem,
    id,
    localStorage,
    rowCount,
    actionshow,
    onSortChange, // Callback function to send sorting info to parent
    paginationShow = true,
    subAction1Show = true,
    subAction2Show = true,
    heightLimit = true,
    extraLayer,
    action,
    getRowStyle= null,
    initialSortBy = null, // Accept initial sort field from props
    initialSortDirection = "asc", // Accept initial sort direction from props
  } = props;

  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  const [sortBy, setSortBy] = React.useState(initialSortBy); // Use prop values
  const [sortDirection, setSortDirection] = React.useState(initialSortDirection); // Use prop values

  // Sync local state with props when they change
  React.useEffect(() => {
    if (initialSortBy !== sortBy) {
      setSortBy(initialSortBy);
    }
    if (initialSortDirection !== sortDirection) {
      setSortDirection(initialSortDirection);
    }
  }, [initialSortBy, initialSortDirection]);

  React.useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSort = (field) => {
    const isSameField = sortBy === field;
    const newDirection = isSameField ? (sortDirection === "asc" ? "desc" : "asc") : "asc";

    setSortBy(field);
    setSortDirection(newDirection);

    // Send sorting info to parent
    onSortChange?.(field, newDirection);
  };

  return (
    <Paper sx={{ boxShadow: configure.box_shadow }}>
      <TableContainer
        onScroll={() => {
          if (localStorage) {
            const elmnt = document.getElementById(id);
            sessionStorage.setItem(localStorage, elmnt.scrollTop);
          }
        }}
        sx={{
          maxHeight: heightLimit ? screenHeight - 300 : "100%",
          whiteSpace: "nowrap",
          overflowX: "auto",
        }}
        id={"tableScroll2"}
      >
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {actionshow && (
                <TableCell
                  style={{
                    backgroundColor: configure.primary_table_color,
                    color: configure.primary_table_text_color,
                    textAlign: "left",
                  }}
                >
                  Action
                </TableCell>
              )}
             {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    backgroundColor: configure.primary_table_color,
                    color: configure.primary_table_text_color,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    cursor: column.sortable ? "pointer" : "default",
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {column.label}
                    {column.sortable && sortBy === column.id && (
                      sortDirection === "asc" ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code} style={getRowStyle ? getRowStyle(row) : {}}>
                {actionshow && (
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-start", alignItems: "center" }}>
                      {subAction1Show && (
                        <Tooltip title="View">
                          <LaunchIcon onClick={() => onSelectItem(row)} style={{ color: "#009197", cursor: "pointer" }} />
                        </Tooltip>
                      )}
                      {subAction2Show ? action(row) : null}
                    </Stack>
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ color: parseFloat(row[column.id]) < 0 ? "#C83232" : "inherit" }}>
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {extraLayer && extraLayer()}
          </TableBody>
        </Table>
      </TableContainer>
      {paginationShow && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default React.memo(TableSorting);
