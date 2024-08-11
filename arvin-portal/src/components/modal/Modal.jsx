import CloseIcon from "@mui/icons-material/Close";
import { Paper } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import Draggable from "react-draggable";
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
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
        open={props.open}
        fullWidth
        maxWidth={props.size}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
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
