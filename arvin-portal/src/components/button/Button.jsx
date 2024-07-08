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
import NavigationHooks from "../../apps/navigation/hooks/NavigationHooks";
import DownloadIcon from "@mui/icons-material/Download";
const ButtonComponent = (props) => {
  const { ...navigationHooks } = NavigationHooks(props);
  const { ...params } = props;
  const active_page = JSON.parse(navigationHooks.active_page);
  console.log(active_page);
  let icon = null;
  let dsbl = null;
  switch (params.iconType) {
    case "add":
      icon = <AddCircleIcon />;
      if (active_page.create == 0) {
        dsbl = true;
      } else {
        dsbl = false;
      }
      break;
    case "submit":
      icon = <CheckCircleIcon />;
      break;
    case "delete":
      icon = <DeleteIcon />;
      if (active_page.delete == 0) {
        dsbl = true;
      } else {
        dsbl = false;
      }
      break;
    case "update":
      icon = <SyncIcon />;
      if (active_page.update == 0) {
        dsbl = true;
      } else {
        dsbl = false;
      }
      break;
    case "login":
      icon = <LoginIcon />;
      break;
    case "filter":
      icon = <FilterAltIcon />;
      break;
    case "generate":
      icon = <TableRowsIcon />;
      if (active_page.generate == 0) {
        dsbl = true;
      } else {
        dsbl = false;
      }
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
    case "export":
      icon = <DownloadIcon />;
      if (active_page.export == 0) {
        dsbl = true;
      } else {
        dsbl = false;
      }
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
      disabled={dsbl}
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
