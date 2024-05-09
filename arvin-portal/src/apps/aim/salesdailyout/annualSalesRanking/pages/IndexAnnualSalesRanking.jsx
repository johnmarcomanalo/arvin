import { Grid } from "@mui/material";
import * as React from "react";
import configure from "../../../../configure/configure.json";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import HomeIcon from "@mui/icons-material/Home";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import AnnualSalesRanking from "./AnnualSalesRanking";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
const title_page = "Annual Sales Ranking";
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
    name: "Sales Daily Out",
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
      <StarIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
export default function IndexAnnualSettingSale() {
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
          <AnnualSalesRanking />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
