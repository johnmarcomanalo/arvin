import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";
import configure from "../../apps/configure/configure.json";
import { ViewAmountFormatingDecimals } from "../../utils/AccountingUtils";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
const CardComponent = (props) => {
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
    enableSubHeaderVariant = true,
    unit,
  } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  let default_color = configure.primary_color;
  if (
    typeof value !== "undefined" &&
    value !== null &&
    value !== ".0000" &&
    value !== ".00"
  ) {
    const value_number = parseFloat(value);
    if (!isNaN(value_number)) {
      const isNegative = value < 0;
      // Format the absolute value of the number with 4 decimal places and commas as thousands separator
      // Add parentheses for negative numbers
      if (isNegative && changeColorValue) {
        default_color = "#C83232";
      } else if (!isNegative && changeColorValue) {
        default_color = "#a5dc86";
      }
    }
  }

  return (
    <Card
      // onClick={props.handleClick}
      className="cursor-pointer"
      sx={{ boxShadow: configure.box_shadow, maxHeight: 100 }}
    >
      <CardContent>
        <CardHeader
          avatar={
            <Avatar
              align="center"
              size="large"
              sx={{
                backgroundColor: "white",
                backgroundColor: "white",
              }}
              aria-label="recipe"
            >
              {icon}
            </Avatar>
          }
          title={
            <Typography
              align="center"
              style={{
                fontWeight: 900,
                color: default_color,
                fontSize: fontSizeValue,
              }}
            >
              {ViewAmountFormatingDecimals(value, 2) +
                (unit ? " (" + unit + ")" : "")}
            </Typography>
          }
          subheader={
            <Typography
              align="center"
              variant={enableSubHeaderVariant ? "caption" : "inherit"}
              style={{ fontWeight: 600, color: configure.secondary_color }}
            >
              {subtitle}
            </Typography>
          }
        />
      </CardContent>
    </Card>
  );
};

export default CardComponent;
