import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import Typography from "@mui/material/Typography";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import configure from "../../configure/configure.json";
import GroupIcon from "@mui/icons-material/Group";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { Collapse, List, ListItem } from "@mui/material";
const drawerWidth = 250;
const ListItemTxt = styled(ListItemText)(({ theme }) => ({
  color: configure.primary_color,
}));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function NavigationAppWork() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [masterList, setMasterList] = React.useState(false);
  const [clickedModuleIndex, setClickedModuleIndex] = React.useState(null);
  const [clickedComponentIndex, setClickedComponentIndex] =
    React.useState(null);
  const [clickedSubComponentIndex, setClickedSubComponentIndex] =
    React.useState(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const onClickSelectedModule = (index) => {
    setClickedModuleIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const onClickSelectedComponent = (index) => {
    setClickedComponentIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };
  const onClickSelectedSubComponent = (index) => {
    setClickedSubComponentIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };
  const modulesAccordion = (modules) => {
    try {
      let module = modules.map((text, index) => {
        const isOpen = clickedModuleIndex === index;
        return (
          <React.Fragment>
            <ListItem disablePadding>
              <ListItemButton onClick={() => onClickSelectedModule(index)}>
                <ListItemText primary={text.description} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}{" "}
              </ListItemButton>
            </ListItem>
            <Divider />

            <Collapse
              in={isOpen}
              timeout="auto"
              style={{ backgroundColor: "#f2f2f2de" }}
              unmountOnExit
            >
              <List component="div" disablePadding>
                {componentsAccordion(configure.component, text)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      });
      return module;
    } catch (error) {
      console.log(error);
    }
  };

  const componentsAccordion = (components, values) => {
    try {
      let component = components.map((text, index) => {
        if (values.modules_code === text.modules_code) {
          const isOpen = clickedComponentIndex === index;
          return (
            <React.Fragment>
              <ListItem disablePadding>
                <ListItemButton onClick={() => onClickSelectedComponent(index)}>
                  <ListItemText primary={text.description} />
                </ListItemButton>
              </ListItem>
              <Divider />

              <Collapse
                in={isOpen}
                timeout="auto"
                style={{ backgroundColor: "#f2f2f2de" }}
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {subcomponentsAccordion(configure.subcomponent, text)}
                </List>
              </Collapse>
            </React.Fragment>
          );
        }
      });
      return component;
    } catch (error) {
      console.log(error);
    }
  };

  const subcomponentsAccordion = (subcomponents, values) => {
    try {
      let component = subcomponents.map((text, index) => {
        if (values.component_code === text.component_code) {
          const isOpen = clickedSubComponentIndex === index;
          return (
            <React.Fragment>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onClickSelectedSubComponent(index)}
                >
                  <ListItemText primary={text.description} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        }
      });
      return component;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AIM PORTAL
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{modulesAccordion(configure.modules)}</List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div
          style={{
            marginLeft: "240px",
          }}
        >
          <Outlet />
        </div>
      </Main>
    </Box>
  );
}
