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
    highlightRules = [],

    loading = false,
    onLoadMore,
    hasMore = false,
    tableRef = null,
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

  const handleScroll = (e) => {
    const target = e.target;

    if (localStorage != "") {
      sessionStorage.setItem(localStorage, target.scrollTop);
    }

    // 🔥 infinite scroll trigger
    if (
      onLoadMore &&
      hasMore &&
      !loading &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 50
    ) {
      onLoadMore();
    }
  };
  return (
    <Paper sx={{ boxShadow: configure.box_shadow }}>
      <TableContainer
        // onScroll={() => {
        //   if (localStorage != "") {
        //     var elmnt = document.getElementById(id);
        //     sessionStorage.setItem(localStorage, elmnt.scrollTop);
        //   }
        // }}
        ref={tableRef}
        onScroll={(e) => {
          if (typeof onLoadMore !== "function") return;

          const el = e.currentTarget;

          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            onLoadMore(); // ✅ ONLY change page
          }
        }}
        sx={{
          maxHeight: heightLimit ? screenHeight - 300 : "100%",
          whiteSpace: "nowrap",
          overflowX: "hidden",
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
                    textAlign: column.align,
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
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => onSelectItem && onSelectItem(row)}
                    sx={{
                      cursor: onSelectItem ? "pointer" : "default",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    {actionshow ? (
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          {subAction1Show ? (
                            <Tooltip title="View">
                              <LaunchIcon
                                onClick={(e) => {
                                  e.stopPropagation(); // 🚀 prevents row click
                                  onSelectItem(row);
                                }}
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

                    {columns.map((column) => {
                      const value = row[column.id];
                      // default styles
                      let cellStyle = { ...column.style };

                      // apply highlight rules only if column matches
                      highlightRules.forEach((rule) => {
                        if (
                          rule.columnId === column.id &&
                          rule.condition(value, row)
                        ) {
                          cellStyle = { ...cellStyle, ...rule.style };
                        }
                      });

                      // add your negative value rule too
                      if (!isNaN(value) && parseFloat(value) < 0) {
                        cellStyle = {
                          ...cellStyle,
                          color: parseFloat(value) < 0 ? "#C83232" : "inherit",
                        };
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            ...cellStyle,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
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
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionshow ? 1 : 0)}
                  align="center"
                  sx={{ py: 2 }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {paginationShow && !onLoadMore ? (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : null} */}
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
