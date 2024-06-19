import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import configuration from "../../apps/configure/configure.json";
const Page = (props) => {
  let itemsPerPage = 10;
  if (props.limitPerPage) {
    itemsPerPage = parseInt(props?.limitPerPage);
  }
  const handlePageChange = (event, page) => {
    if (props.onHandleChange) {
      props.onHandleChange(event, page);
    }
  };
  return (
    <Stack spacing={2}>
      {props.showPage ? <Typography>Page: {props.page}</Typography> : null}
      <Pagination
        color="secondary"
        onChange={handlePageChange}
        count={Math.ceil(parseInt(props.limit) / itemsPerPage)}
        page={parseInt(props.page)}
      />
    </Stack>
  );
};

export default Page;
