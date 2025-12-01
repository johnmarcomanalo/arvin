import AssessmentIcon from "@mui/icons-material/Assessment";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Grid } from "@mui/material";
import configure from "apps/configure/configure.json";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import PageTitle from "components/pageTItle/PageTitle";
import * as React from "react";
import CollectorReport from "./CollectorReport";
const title_page = "Collector Report";
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
    name: "E-PayCheck",
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
    name: "Reports",
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
      <SummarizeIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
export default function IndexCollectorReport() {
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle title={title_page} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CollectorReport />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
