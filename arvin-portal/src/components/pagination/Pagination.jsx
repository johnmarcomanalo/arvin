import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
// interface InputFieldProps {
//   page?: any;
//   limit?: any;
//   status?: any;
//   showPage?: boolean;
//   onHandleChange?: (event: any, page: any) => void;
// }
const Page = (props) => {
  const itemsPerPage = 12;
  const handlePageChange = (
    event,
    page
  ) => {
    if (props.onHandleChange) {
      props.onHandleChange(event, page);
    }
  };
  return (
    <Stack spacing={2}>
      {props.showPage ? <Typography>Page: {props.page}</Typography> : null}
      <Pagination
        onChange={handlePageChange}
        count={Math.ceil(parseInt(props.limit) / itemsPerPage)}
        page={parseInt(props.page)}
      />
    </Stack>
  );
};

export default Page;
