import LaunchIcon from "@mui/icons-material/Launch";
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
import React from "react";
import configure from "../../apps/configure/configure.json";
import { Stack } from "@mui/material";
const Tables = (props) => {
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
    action,
    actionshow,
    paginationShow = true,
    subAction1Show = true,
    subAction2Show = true,
    heightLimit = true,
    extraLayer,
    changeZerotoDash = false,
    sticky = false,
  } = props;
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const actionShowStyle = [
    {
      backgroundColor: configure.primary_table_color,
      color: configure.primary_table_text_color,
      textAlign: "left",
    },
  ];
  const actionShowStickyStyle = [
    {
      backgroundColor: configure.primary_table_color,
      color: configure.primary_table_text_color,
      textAlign: "left",
      position: sticky ? "sticky" : "static",
      left: 0,
      zIndex: 3,
    },
  ];

  const headerColumnStyle = {
    backgroundColor: configure.primary_table_color,
    color: configure.primary_table_text_color,
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const headerColumnStickyStyle = (index) => ({
    ...headerColumnStyle, // Keep consistent styling
    // position: index === 0 ? "sticky" : "static",
    left: index === 0 ? (actionshow ? 50 : 0) : "auto",
    zIndex: index === 0 ? 4 : 2,
  });

  const actionBodyShowStyle = [
    {
      backgroundColor: configure.primary_table_color,
      color: configure.primary_table_text_color,
      textAlign: "left",
    },
  ];
  const actionBodyShowStickyStyle = [
    {
      backgroundColor: configure.primary_table_color,
      color: configure.primary_table_text_color,
      textAlign: "left",
      position: sticky ? "sticky" : "static",
      left: 0,
      zIndex: 3,
    },
  ];

  const bodyColumnStyle = (value) => ({
    color: parseFloat(value) < 0 ? "#C83232" : "inherit",
    textAlign: "left",
    whiteSpace: "nowrap",
  });

  const bodyColumnStickyStyle = (value, columnIndex) => ({
    ...bodyColumnStyle, // Keep consistent styling
    backgroundColor: "white",
    color: parseFloat(value) < 0 ? "#C83232" : "inherit",
    left: columnIndex === 0 ? (actionshow ? 50 : 0) : "auto",
    zIndex: columnIndex === 0 ? 2 : 1,
    position: sticky ? "sticky" : "static",
    whiteSpace: "nowrap",
  });

  return (
    <Paper sx={{ boxShadow: configure.box_shadow }}>
      <TableContainer
        onScroll={() => {
          if (localStorage != "") {
            var elmnt = document.getElementById(id);
            sessionStorage.setItem(localStorage, elmnt.scrollTop);
          }
        }}
        sx={{
          maxHeight: heightLimit ? screenHeight - 300 : "100%",
          whiteSpace: "nowrap",
          // overflowX: "auto",
          overflow: "auto",
        }}
        id={"tableScroll2"}
      >
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {actionshow ? (
                <TableCell
                  style={sticky ? actionShowStickyStyle : actionShowStyle}
                >
                  Action
                </TableCell>
              ) : null}

              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={
                    sticky ? headerColumnStickyStyle(index) : headerColumnStyle
                  }
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
                  <TableRow
                    style={{ backgroundColor: "white" }}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                  >
                    {actionshow ? (
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          style={
                            sticky
                              ? actionBodyShowStickyStyle
                              : actionBodyShowStyle
                          }
                        >
                          {subAction1Show ? (
                            <Tooltip title="View">
                              <LaunchIcon
                                onClick={() => onSelectItem(row)}
                                style={{
                                  color: "#009197",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          ) : null}
                          {subAction2Show ? action(row) : null}
                        </Stack>
                      </TableCell>
                    ) : null}

                    {columns.map((column, columnIndex) => {
                      let value = row[column.id];
                      if (changeZerotoDash) {
                        if (
                          value === 0 ||
                          value === "0.00" ||
                          value === 0.0 ||
                          value === ".0000"
                        ) {
                          value = "--";
                        }
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={
                            sticky
                              ? bodyColumnStickyStyle(value, columnIndex)
                              : bodyColumnStyle(value, columnIndex)
                          }
                        >
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
            {extraLayer && extraLayer()}
          </TableBody>
        </Table>
      </TableContainer>
      {paginationShow ? (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          sx={{ backgroundColor: "none" }}
        />
      ) : null}
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
