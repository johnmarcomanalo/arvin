import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Collapse, List, ListItem } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Modal from "../../../components/modal/Modal";
import configure from "../../configure/configure.json";
import NavigationHooks from "../hooks/NavigationHooks";
import RequestsForm from "./components/RequestForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
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
    overflowX: "hidden",
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

export default function Navigation(props) {
  const { ...navigation_param } = NavigationHooks(props);
  const access = navigation_param.access;
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [requestlist, setRequestList] = React.useState(false);
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
    setRequestList(false);
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
  const onClickSelectRequest = () => {
    setRequestList(!requestlist);
  };
  const onClickLogout = () => {
    localStorage.clear();
    navigate("/login");
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
                {componentsAccordion(access.user_access_component_rights, text)}
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
        if (values.module_code === text.module_code) {
          const isOpen = clickedComponentIndex === index;
          const hasSubcomponents = access.user_access_sub_component_rights.some(
            (sub_component) =>
              sub_component.component_code === text.component_code
          );
          return (
            <React.Fragment>
              <ListItem disablePadding>
                {hasSubcomponents ? (
                  <ListItemButton
                    onClick={() => onClickSelectedComponent(index)}
                  >
                    <ListItemText primary={text.description} />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}{" "}
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    href={text.link}
                    underline="none"
                    onClick={() => navigation_param.onSelectActivePage(text)}
                  >
                    <ListItemText primary={text.description} />
                  </ListItemButton>
                )}
              </ListItem>
              <Divider />

              {hasSubcomponents && (
                <Collapse
                  in={isOpen}
                  timeout="auto"
                  style={{ backgroundColor: "#f2f2f2de" }}
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {sub_componentsAccordion(
                      access.user_access_sub_component_rights,
                      text
                    )}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        }
      });
      return component;
    } catch (error) {
      console.log(error);
    }
  };

  const sub_componentsAccordion = (sub_components, values) => {
    try {
      let component = sub_components.map((text, index) => {
        if (values.component_code === text.component_code) {
          return (
            <React.Fragment>
              <ListItem disablePadding>
                <ListItemButton
                  href={text.link}
                  underline="none"
                  onClick={() => navigation_param.onSelectActivePage(text)}
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
      <Modal
        open={navigation_param.request_modal}
        fullScreen={false}
        title={"Request Form"}
        size={"xs"}
        action={undefined}
        handleClose={navigation_param.onCloseRequestModal}
      >
        <RequestsForm />
      </Modal>
      <Modal
        open={navigation_param.setting_modal}
        fullScreen={false}
        title={"Change Password Form"}
        size={"xs"}
        action={undefined}
        handleClose={navigation_param.onCloseSettingModal}
      >
        <ChangePasswordForm />
      </Modal>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: configure.primary_color }}
      >
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
            {configure.systemName}
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
        <List>
          <ListItem disablePadding>
            <ListItemButton href={"/"} underline="none">
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
          <Divider />
          {modulesAccordion(access?.user_access_module_rights)}
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => onClickSelectRequest()}>
              <ListItemText primary={"Account Settings"} />
              {requestlist ? <ExpandLess /> : <ExpandMore />}{" "}
            </ListItemButton>
          </ListItem>
          <Divider />

          <Collapse
            in={requestlist}
            timeout="auto"
            style={{ backgroundColor: "#f2f2f2de" }}
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigation_param.onOpenSettingModal()}
                >
                  <ListItemText primary={"Change Password"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onClickLogout();
              }}
            >
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
