import { Routes, Route } from "react-router-dom";
import {
  ChevronLeft,
  Dashboard,
  KingBed,
  Logout,
  MarkChatUnread,
  NotificationsActive,
  PeopleAlt,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/users";
import { useValue } from "../../context/ContextProvider";
import Main from "./main/Main";

// import useCheckToken from "../../hooks/useCheckToken";
// import isAdmin from "./utils/isAdmin";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideList = ({ open, setOpen }) => {
  //   useCheckToken();
  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  const [selectedLink, setSelectedLink] = useState("");

  const list = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: <Dashboard />,
        link: "",
      },
      {
        title: "Users",
        icon: <PeopleAlt />,
        link: "users",
      },

      {
        title: "Rooms",
        icon: <KingBed />,
        link: "rooms",
      },
      {
        title: "Requests",
        icon: <NotificationsActive />,
        link: "requests",
      },
      {
        title: "Messages",
        icon: <MarkChatUnread />,
        link: "messages",
      },
    ],
    [currentUser]
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(dispatch);
  };
  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {list.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => navigate(item.link)}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />

        <Box sx={{ textAlign: "center" }}>
          <Tooltip title="Logout" sx={{ mt: 1 }}>
            <IconButton onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route
            path="*"
            element={<Main {...{ setSelectedLink, link: "" }} />}
          />
        </Routes>
      </Box>
    </>
  );
};

export default SideList;
