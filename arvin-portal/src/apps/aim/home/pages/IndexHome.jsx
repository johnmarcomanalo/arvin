import { Grid } from "@mui/material";
import * as React from "react";
import configure from "apps/configure/configure.json";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import HomeIcon from "@mui/icons-material/Home";
import Home from "./Home";
const breadCrumbArray = [
  {
    name: "Home",
    href: "",
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
];
export default function IndexHome() {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Home />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
