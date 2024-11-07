import {
  Stack,
  useMediaQuery,
  Avatar,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import configure from "../../apps/configure/configure.json";
import { ViewAmountFormatingDecimals } from "../../utils/AccountingUtils";
import InfoIcon from "@mui/icons-material/Info";
const CardWithTitleValueIcon = (props) => {
  const {
    icon,
    subtitle,
    value,
    fontSizeValue = "0.875rem",
    changeColorValue = false,
    unit,
    else_color,
  } = props;

  const [expanded, setExpanded] = React.useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const handleExpandClick = () => setExpanded(!expanded);

  let default_color = configure.tertiary_color;
  if (else_color) {
    default_color = "#C83232";
  } else if (
    typeof value !== "undefined" &&
    value !== null &&
    value !== ".0000" &&
    value !== ".00"
  ) {
    const value_number = parseFloat(value);
    if (!isNaN(value_number)) {
      const isNegative = value_number < 0;
      if (isNegative && changeColorValue) {
        default_color = "#C83232";
      }
    }
  }

  return (
    <Card
      className="cursor-pointer"
      sx={{
        boxShadow: configure.box_shadow,
        backgroundColor: configure.primary_color,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography
            align="left"
            style={{
              fontWeight: 600,
              color: configure.tertiary_color,
              fontSize: "0.9rem",
            }}
          >
            {subtitle}
          </Typography>
          {icon}
        </Stack>
        <Stack
          direction="row"
          sx={{ justifyContent: "flex-start", alignItems: "center" }}
        >
          <Typography
            align="center"
            style={{
              fontWeight: 900,
              color: default_color,
              fontSize: "0.9rem",
            }}
          >
            {ViewAmountFormatingDecimals(value, 2)}
          </Typography>
          {unit && (
            <Typography
              align="center"
              style={{
                fontWeight: 900,
                color: default_color,
                fontSize: "0.9rem",
              }}
            >
              {` (${unit})`}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default CardWithTitleValueIcon;
