import AssessmentIcon from "@mui/icons-material/Assessment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { Grid } from "@mui/material";
import * as React from "react";
import BreadCrumbs from "../../../../../../components/breadCrumb/BreadCrumbs";
import PageTitle from "../../../../../../components/pageTItle/PageTitle";
import configure from "../../../../../configure/configure.json";
import DavaoTKS from "./DavaoTKS";

const title_page = "Davao TKS";
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
    name: "Sales",
    href: "",
    icon: (
      <FormatQuoteIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Report",
    href: "",
    icon: (
      <AssessmentIcon
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
export default function IndexDavaoTKS() {
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
          <DavaoTKS />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
