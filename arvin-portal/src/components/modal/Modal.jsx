import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// interface Props {
//   open: boolean;
//   handleClose?: () => void;
//   title: string;
//   children?: React.ReactNode;
//   size: any;
//   action: React.ReactNode;
//   fullScreen?: boolean;
// }
export default function Modal(props) {
  return (
    <div>
      <BootstrapDialog
        fullScreen={props.fullScreen}
        onClose={props.handleClose ? props.handleClose : undefined}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        fullWidth
        maxWidth={props.size}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {`${props.title}`}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={props.handleClose}
          sx={{
            display: props.handleClose ? undefined : "none",
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{props.children}</DialogContent>
        {/* <DialogActions>
            {props.action}
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}
