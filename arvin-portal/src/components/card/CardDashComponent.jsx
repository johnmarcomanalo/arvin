import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import configure from "../../apps/configure/configure.json";

const CardDashComponent = (props) => {
  const {
    icon,
    icon_color,
    icon_bgcolor,
    title,
    subtitle,
    value,
    subvalue,
    fontSizeValue = "0.875rem",
    changeColorValue = false,
  } = props;
  return (
    <Card
      // onClick={props.handleClick}
      className="cursor-pointer"
      sx={{ boxShadow: configure.box_shadow }}
    >
      <CardContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
        >
          <Typography
            style={{
              fontWeight: 900,
              color: configure.primary_color,
              fontSize: fontSizeValue,
            }}
            gutterBottom
          >
            Title Card
          </Typography>
          <Typography
            style={{
              color: configure.primary_color,
              fontSize: fontSizeValue,
            }}
            variant="caption"
          >
            400,000.00
          </Typography>
          <Typography
            style={{
              color: configure.primary_color,
              fontSize: "0.8rem",
            }}
          >
            0.00% this month
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CardDashComponent;
