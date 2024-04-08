import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Grid } from "@mui/material";
const renderEqualProps = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};
// function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {}
const handleClick = (event) => {
  // Your event handling logic goes here
};
const BreadCrumbs = (props) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Breadcrumbs aria-label="breadcrumb" onClick={handleClick}>
          {props.breadCrumbs.map((val, index) => {
            return (
              <Link
                key={val.name}
                underline="none"
                sx={{ display: "flex", alignItems: "center", fontSize: 12 }}
                color="inherit"
                href={val.href === "" ? "#" : val.href}
              >
                {val.icon}
                {val.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};
export default React.memo(BreadCrumbs, renderEqualProps);
