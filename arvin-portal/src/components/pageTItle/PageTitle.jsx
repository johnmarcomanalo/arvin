import { Typography } from "@mui/material";
import React from "react";
import configure from "../../apps/configure/configure.json";
const renderEqualProps = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

const PageTitle = (props) => {
  return (
    <Typography
      variant="h6"
      align="left"
      sx={{ fontWeight: 600, color: configure.primary_color }}
    >
      {props.title}
      {props.subtitle ? " - " + props.subtitle : null}
    </Typography>
  );
};

export default React.memo(PageTitle, renderEqualProps);
