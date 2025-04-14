import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import PaidIcon from '@mui/icons-material/Paid';
import { Grid,Chip,Box,Typography,Stack,useMediaQuery } from "@mui/material";
import configure from "apps/configure/configure.json";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import PageTitle from "components/pageTItle/PageTitle";
import * as React from "react";
import CheckCollection from "./CheckCollection";
const title_page = "Check Collection";
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
    name: "Check Collection",
    href: "/Modules/E-PayCheck/CheckCollection",
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
export default function IndexCheckCollection() {
  const matches         = useMediaQuery("(min-width:600px)"); 
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
        <Stack
                  direction={matches ? "row" : "column"}
                  alignItems={matches ? "center" : "flex-start"}
                  justifyContent="space-between"
                  spacing={1}
                >
          <PageTitle title={title_page} />
          <Box display="flex" alignItems="center" mb={3}>
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>
                      Legend:
                    </Typography>
                    <Chip label="Required Field" sx={{ backgroundColor: '#ffdddd', mr: 1 }} />
                    <Chip label="Optional Field" sx={{ backgroundColor: '#f0f0f0', mr: 1 }} />
                  </Box>
        </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CheckCollection />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
