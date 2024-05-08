import { Grid } from "@mui/material";
import * as React from "react";
import configure from "../../../../configure/configure.json";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import HomeIcon from "@mui/icons-material/Home";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import DailyQuota from "./SalesDailyOut";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SalesDailyOutComponentIndexSalesDailyOutHooks from "../hooks/SalesDailyOutComponentIndexSalesDailyOutHooks";
const title_page = "Sales Daily Out";
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
export default function IndexSalesDailyOut(props) {
  const { ...salesDailyOutComponentIndexSalesDailyOut } =
    SalesDailyOutComponentIndexSalesDailyOutHooks(props);
  const selected_subsection =
    salesDailyOutComponentIndexSalesDailyOut?.selected_subsection;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>{" "}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle
            title={title_page}
            subtitle={selected_subsection.description}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <DailyQuota />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
