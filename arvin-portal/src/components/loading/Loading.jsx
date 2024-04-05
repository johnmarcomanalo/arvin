import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export default function Loader() {
  // const isLoading = useSelector((state: any) => state.LoginReducer.isLoading);
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999999999,
        }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
