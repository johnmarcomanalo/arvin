import BadgeIcon from "@mui/icons-material/Badge";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import configure from "apps/configure/configure.json";
import { React } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const EmployeeDetailsHooks = (props) => {
  const { id } = useParams();
  const refresh = useSelector((state) => state.HumanResourceReducer.refresh);
  const tabs = [
    {
      id: "personal",
      label: "Personal Details",
      icon: (
        <PersonIcon
          sx={{
            fontSize: configure.bread_crumbs_font_size,
            color: configure.primary_color,
          }}
        />
      ),
    },
    {
      id: "account",
      label: "Account Details",
      icon: (
        <BadgeIcon
          sx={{
            fontSize: configure.bread_crumbs_font_size,
            color: configure.primary_color,
          }}
        />
      ),
    },
    {
      id: "employment",
      label: "Employment Info",
      icon: (
        <BadgeIcon
          sx={{
            fontSize: configure.bread_crumbs_font_size,
            color: configure.primary_color,
          }}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: (
        <FolderIcon
          sx={{
            fontSize: configure.bread_crumbs_font_size,
            color: configure.primary_color,
          }}
        />
      ),
    },
  ];
  return {
    tabs,
    refresh,
  };
};

export default EmployeeDetailsHooks;
