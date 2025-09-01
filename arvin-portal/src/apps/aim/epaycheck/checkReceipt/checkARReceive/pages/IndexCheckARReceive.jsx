import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import { Grid } from "@mui/material";
import * as React from "react";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import PageTitle from "components/pageTItle/PageTitle";
import configure from "apps/configure/configure.json";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from '@mui/icons-material/Paid';
import CheckARReceive from "./CheckARReceive";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
const title_page = "Check AR Receive"
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
    name: "EpayCheck",
    href: "",
    icon: (
      <PaidIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Check Receive",
    href: "/Modules/E-PayCheck/IndexCheckARReceive",
    icon: (
      <GroupIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
export default function IndexCheckARReceive() {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle title={title_page} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CheckARReceive />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
