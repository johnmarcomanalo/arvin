import {
  Card,
  CardContent,
  Avatar,
  CardHeader,
  Divider,
  Grid,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import configure from "apps/configure/configure.json";
import EmployeeDetailsHooks from "../hooks/EmployeeDetailsHooks";
export default function EmployeeDetails(props) {
  const { ...employeeDetails } = EmployeeDetailsHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen2 = useMediaQuery(theme.breakpoints.down("sl"));
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Card
            sx={{
              boxShadow: configure.box_shadow,
            }}
          >
            <CardHeader
              sx={{
                color: configure.primary_color,
                fontSize: 10,
              }}
              title="Employee Details"
            />
            <CardContent>
              <List component="nav" dense={true}>
                {employeeDetails.tabs.map((values, index) => {
                  return (
                    <ListItemButton underline="none">
                      <ListItemIcon>{values.icon}</ListItemIcon>
                      <ListItemText
                        primary={values.label}
                        sx={{
                          color: configure.primary_color,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={9} lg={9}>
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
                    JOHN MARCO MANALO
                  </Typography>
                  <Stack
                    direction={isSmallScreen2 ? "column" : "row"}
                    justifyContent={isSmallScreen ? "center" : "flex-start"}
                    alignItems={isSmallScreen ? "center" : "flex-start"}
                    spacing={2}
                  >
                    <AccountCircleOutlinedIcon color="text.secondary" />
                    <Typography color="text.secondary">qwerew</Typography>
                  </Stack>
                  <Stack
                    direction={isSmallScreen2 ? "column" : "row"}
                    justifyContent={isSmallScreen ? "center" : "flex-start"}
                    alignItems={isSmallScreen ? "center" : "flex-start"}
                    spacing={2}
                  >
                    <MapsHomeWorkOutlinedIcon color="text.secondary" />
                    <Typography color="text.secondary">wqerew</Typography>
                  </Stack>
                </Stack>
              </Stack>
              {/* here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
