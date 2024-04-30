import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // ES6
import LaunchIcon from "@mui/icons-material/Launch";
import configure from "../../apps/configure/configure.json";
const Tables = (props) => {
  const {
    columns,
    dataList,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    onSelectItem,
    id,
    localStorage,
    rowCount = 0,
    action,
    actionshow,
  } = props;
  return (
    <Paper sx={{ width: "100%", boxShadow: configure.box_shadow }}>
      <TableContainer
        onScroll={() => {
          if (localStorage != "") {
            var elmnt = document.getElementById(id);
            sessionStorage.setItem(localStorage, elmnt.scrollTop);
          }
        }}
        id={"tableScroll2"}
      >
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {actionshow ? (
                <TableCell
                  style={{
                    backgroundColor: configure.primary_table_color,
                    color: configure.primary_table_text_color,
                    textAlign: "left",
                  }}
                >
                  Action
                </TableCell>
              ) : null}

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    backgroundColor: configure.primary_table_color,
                    color: configure.primary_table_text_color,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList?.map((row) => {
              try {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {actionshow ? (
                      <TableCell>
                        <Tooltip title="View">
                          <LaunchIcon
                            onClick={() => onSelectItem(row)}
                            style={{
                              color: "#009197",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                        {action(row)}
                      </TableCell>
                    ) : null}

                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column?.format != undefined
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              } catch (error) {
                console.log(error);
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowCount == 0 ? dataList?.length : rowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        sx={{ backgroundColor: "none" }}
      />
    </Paper>
  );
};

Tables.prototype = {
  columns: PropTypes.array,
  dataList: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  additionalHeader: PropTypes.any,
  additionalAction: PropTypes.any,
};

export default React.memo(Tables);
