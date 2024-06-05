import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import * as React from "react";
import configure from "../../../configure/configure.json";
import Attendance from "./components/Attendance";
import Information from "./components/Informations";
import Requests from "./components/Requests";
import HomeHooks from "../hooks/HomeHooks";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const { ...home } = HomeHooks();
  const account_details = home.account_details;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down("sl"));
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardContent>
              <Stack
                direction={isSmallScreen ? "column" : "row"}
                justifyContent={isSmallScreen ? "center" : "flex-start"}
                alignItems={isSmallScreen ? "center" : "flex-start"}
                spacing={2}
                flexWrap={isSmallScreen ? "wrap" : "nowrap"}
              >
                <Avatar
                  sx={{
                    width: { xs: 70, sm: 90, md: 110, xl: 130 },
                    height: { xs: 70, sm: 90, md: 110, xl: 130 },
                    backgroundColor: configure.secondary_color,
                  }}
                >
                  hi
                </Avatar>
                <Stack
                  direction={isSmallScreen2 ? "row" : "column"}
                  justifyContent={isSmallScreen ? "center" : "flex-start"}
                  alignItems={isSmallScreen ? "center" : "flex-start"}
                  spacing={2}
                  flexWrap={isSmallScreen ? "wrap" : "nowrap"}
                >
                  <Typography variant="h6" component="div">
                    {account_details?.first_name +
                      " " +
                      account_details?.last_name}
                  </Typography>
                  <Stack
                    direction={isSmallScreen2 ? "column" : "row"}
                    justifyContent={isSmallScreen ? "center" : "flex-start"}
                    alignItems={isSmallScreen ? "center" : "flex-start"}
                    spacing={2}
                  >
                    <AccountCircleOutlinedIcon color="text.secondary" />
                    <Typography color="text.secondary">
                      {account_details?.position}
                    </Typography>
                  </Stack>
                  <Stack
                    direction={isSmallScreen2 ? "column" : "row"}
                    justifyContent={isSmallScreen ? "center" : "flex-start"}
                    alignItems={isSmallScreen ? "center" : "flex-start"}
                    spacing={2}
                  >
                    <MapsHomeWorkOutlinedIcon color="text.secondary" />
                    <Typography color="text.secondary">
                      {account_details?.position}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
            <Box sx={{ width: "100%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Information" {...a11yProps(0)} />
                <Tab label="Attendance" {...a11yProps(1)} />
                <Tab label="Requests" {...a11yProps(2)} />
              </Tabs>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CustomTabPanel value={value} index={0}>
            <Information />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Attendance />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Requests />
          </CustomTabPanel>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
