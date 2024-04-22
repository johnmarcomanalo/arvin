import React, { ReactNode } from "react";
import Button from "@mui/material/Button";
import configure from "../../apps/configure/configure.json";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";
import HelpIcon from "@mui/icons-material/Help";
const ButtonComponent = (props) => {
  const { ...params } = props;
  let icon = null;
  switch (params.iconType) {
    case "add":
      icon = <AddCircleIcon />;
      break;
    case "submit":
      icon = <CheckCircleIcon />;
      break;
    case "delete":
      icon = <DeleteIcon />;
      break;
    case "update":
      icon = <SyncIcon />;
      break;
    default:
      icon = <HelpIcon />;
      break;
  }
  return (
    <Button
      sx={props.stx}
      fullWidth={params?.fullwidth}
      // data-testid={params.dataTestId}
      type={params?.type}
      variant="contained"
      startIcon={icon}
      onClick={() => {
        if (params.click) {
          params.click(); // Invoke params.click if it exists
        }
      }}
    >
      {params?.children}
    </Button>
  );
};

export default ButtonComponent;
