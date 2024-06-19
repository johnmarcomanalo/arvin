import React, { ReactNode } from "react";
import Button from "@mui/material/Button";
import configure from "../../apps/configure/configure.json";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";
import HelpIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TableRowsIcon from "@mui/icons-material/TableRows";
import RefreshIcon from "@mui/icons-material/Refresh";
import TimelineIcon from "@mui/icons-material/Timeline";
import LaunchIcon from "@mui/icons-material/Launch";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    case "login":
      icon = <LoginIcon />;
      break;
    case "filter":
      icon = <FilterAltIcon />;
      break;
    case "generate":
      icon = <TableRowsIcon />;
      break;
    case "refresh":
      icon = <RefreshIcon />;
      break;
    case "graph":
      icon = <TimelineIcon />;
      break;
    case "view":
      icon = <LaunchIcon />;
      break;
    case "view2":
      icon = <VisibilityIcon />;
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
