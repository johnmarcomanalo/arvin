import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid } from "@mui/material";
import * as React from "react";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import configure from "../../../../configure/configure.json";
import RequestQuotation from "./RequestQuotation";
const title_page = "Quote";
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
    name: "Quotation",
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
  ,
  {
    name: "Request",
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
    name: title_page,
    href: "",
    icon: (
      <RequestPageIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
export default function IndexRequest() {
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
          <RequestQuotation />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
