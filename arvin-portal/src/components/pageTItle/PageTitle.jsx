import { Typography } from "@mui/material";
import React from "react";
// interface PageTitleProps {
//   title: string;
// }

const renderEqualProps = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

const PageTitle = (props) => {
  return (
    <div>
      <Typography variant="h6">{props.title}</Typography>
    </div>
  );
};

export default React.memo(PageTitle, renderEqualProps);
