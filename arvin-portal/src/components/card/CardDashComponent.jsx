import { Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import configure from "../../apps/configure/configure.json";

const CardDashComponent = (props) => {
  const { fontSizeValue = "0.875rem", title, value, alignValue } = props;
  return (
    <Card sx={{ boxShadow: configure.box_shadow }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              style={{
                fontWeight: 900,
                color: configure.primary_color,
                fontSize: fontSizeValue,
              }}
              align="left"
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              style={{
                color: configure.primary_color,
                fontSize: fontSizeValue,
              }}
              align="center"
              variant="caption"
            >
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CardDashComponent;
