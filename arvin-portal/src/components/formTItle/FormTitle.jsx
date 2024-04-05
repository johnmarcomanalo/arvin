import { Typography } from "@mui/material";
import React from "react";
const FormTitle = (props) => {
  return (
    <div>
      <Typography variant="h6" sx={{ fontSize: 17, fontWeight: "bold" }}>
        {props.title}
      </Typography>
    </div>
  );
};

export default FormTitle;
