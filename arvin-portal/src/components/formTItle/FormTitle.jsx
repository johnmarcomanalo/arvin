import { Typography } from "@mui/material";
import React from "react";
import configure from "../../apps/configure/configure.json";
const FormTitle = (props) => {
  return (
    <Typography variant="body2" sx={{ color: configure.primary_color }}>
      {props.title}
    </Typography>
  );
};

export default FormTitle;
