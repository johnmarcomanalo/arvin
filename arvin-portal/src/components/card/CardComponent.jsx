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
  const { icon, icon_color, icon_bgcolor, title, subtitle, value, subvalue } =
    props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  let default_color = "";
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
      if (isNegative) {
        default_color = "#C83232";
      } else {
        default_color = configure.primary_color;
      }
    }
  }

  return (
    <Card
      // onClick={props.handleClick}
      className="cursor-pointer"
      sx={{ boxShadow: configure.box_shadow }}
    >
      <CardContent>
        <CardHeader
          avatar={
            <Avatar
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
              style={{
                fontWeight: 900,
                color: default_color,
              }}
            >
              {ViewAmountFormatingDecimals(value, 2)}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              style={{ fontWeight: 900, color: configure.secondary_color }}
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
