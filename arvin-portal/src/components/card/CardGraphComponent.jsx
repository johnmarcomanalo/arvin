import { Button, Grid, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import configure from "../../apps/configure/configure.json";
import ButtonComponent from "../button/Button";
import { useNavigate } from "react-router-dom";

const CardDashComponent = (props) => {
  const navigate = useNavigate();
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
    graph,
  } = props;
  const onClickCard = () => {
    navigate("4/05/2024");
  };
  return (
    <Card
      // onClick={props.handleClick}
      className="cursor-pointer"
      sx={{ boxShadow: configure.box_shadow }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
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
                Warehouse
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
              <ButtonComponent
                stx={configure.default_button}
                iconType="view"
                type="button"
                fullwidth={true}
                children={"View"}
                click={onClickCard}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            {graph}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CardDashComponent;
