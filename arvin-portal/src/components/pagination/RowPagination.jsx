import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import configuration from "../../apps/configure/configure.json";
import TablePagination from "@mui/material/TablePagination";
const RowPage = (props) => {
  let itemsPerPage = props?.rows ? props?.rows : 10;
  if (props.limitPerPage) {
    itemsPerPage = parseInt(props?.limitPerPage);
  }
  const handlePageChange = (event, page) => {
    if (props.onPageChange) {
      props.onHandlePageChange(event, page);
    }
  };
  const handleRowChange = (event, page) => {
    if (props.onRowChange) {
      props.onRowChange(event, page);
    }
  };
  return (
    <Stack spacing={2}>
      {props.showPage ? <Typography>Page: {props.page}</Typography> : null}
      {/* <Pagination
        color="secondary"
        onChange={handlePageChange}
        count={Math.ceil(parseInt(props.limit) / itemsPerPage)}
        page={parseInt(props.page)}
      /> */}

      <TablePagination
        component="div"
        count={Math.ceil(parseInt(props.limit) / itemsPerPage)}
        page={parseInt(props.page)}
        onPageChange={handlePageChange}
        rowsPerPage={props?.rows}
        onRowsPerPageChange={handleRowChange}
      />
    </Stack>
  );
};

export default RowPage;
