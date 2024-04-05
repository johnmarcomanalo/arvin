import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
interface ImageViewerProps {
  imageSrc: any;
  open: any;
  onClose?: () => void;
}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ImageViewer = (props: ImageViewerProps) => {
  return (
    <BootstrapDialog
      onClose={props?.onClose}
      aria-labelledby="customized-dialog-title"
      open={props?.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Image Viewer
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <img
          src={props?.imageSrc}
          alt="Image"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </DialogContent>
    </BootstrapDialog>
  );
};

export default ImageViewer;
