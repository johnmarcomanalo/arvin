import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import * as React from "react";
import configure from "../../apps/configure/configure.json";
import { ViewAmountFormatingDecimals } from "../../utils/AccountingUtils";

const CardGradient = (props) => {
  const { child } = props;

  let default_color = configure.primary_color;

  const gradientBackground = `linear-gradient(to bottom right, rgb(9,58,92), rgb(16,84,130), rgb(23,110,168))`;
  return (
    <Card
      className="cursor-pointer"
      sx={{
        boxShadow: configure.box_shadow,
      }}
    >
      <CardContent>{child}</CardContent>
    </Card>
  );
};

export default CardGradient;
