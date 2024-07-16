import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { Grid } from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import BreadCrumbs from "../../../../../../components/breadCrumb/BreadCrumbs";
import PageTitle from "../../../../../../components/pageTItle/PageTitle";
import configure from "../../../../../configure/configure.json";
import ChangePassword from "./ChangePassword";
const title_page = "Change Password";
const breadCrumbArray = [
  {
    name: "Home",
    href: "/",
    icon: (
      <HomeIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Settings",
    href: "",
    icon: (
      <SettingsIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Account Settings",
    href: "",
    icon: (
      <ManageAccountsIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: title_page,
    href: "",
    icon: (
      <PasswordIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
export default function IndexSalesTracker(props) {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>{" "}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle title={title_page} />
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ChangePassword />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
