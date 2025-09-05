import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { Grid } from "@mui/material";
import configure from "apps/configure/configure.json";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import PageTitle from "components/pageTItle/PageTitle";
import * as React from "react";
import ClientSalesSummary from "./ClientSalesSummary";
const title_page = "Weekly & Monthly Sales Summary Report";
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
    name: "Sales Tracker",
    href: "",
    icon: (
      <QueryStatsIcon
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
export default function IndexClientSalesSummary(props) {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>{" "} 
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ClientSalesSummary />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
