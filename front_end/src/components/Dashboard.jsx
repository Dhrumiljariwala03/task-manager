import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, useTheme, Box } from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Dashboard as DashboardIcon, Group as GroupIcon, Security as SecurityIcon, Assignment as AssignmentIcon, BarChart as BarChartIcon, Menu as MenuIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from "@mui/icons-material";
import { Avatar, Dropdown, Menu, Modal, Button } from "antd";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import UserManagment from "./UserManagment";
import TeamManagment from "./TeamManagment";
import GroupsIcon from '@mui/icons-material/Groups';

const drawerWidth = 250;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? drawerWidth : 0,
  })
);

const AppBarStyled = styled(AppBar, {
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

const DrawerHeader = styled("div")(({ theme }) => ({ display: "flex", alignItems: "center", padding: theme.spacing(0, 1), ...theme.mixins.toolbar, justifyContent: "flex-end" }));
const sections = { dashboard: "Dashboard", userManagement: "User Management", teamManagement: "Team Management", roles: "Roles", projects: "Projects", reports: "Reports" };

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState(sections.dashboard);
  const [image, setimage] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const darkTheme = createTheme({
    palette: {
      mode: darkMode ? "light" : "dark",
    },
  });


  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;

      axios
        .get(`http://localhost:4000/api/user/getuserbyid/${userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const userData = response.data.data;
          setimage(`http://localhost:4000/image/${userData.image}`);
          setUsername(userData.username);
          setRole(userData.role);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuClick = (e) => {
    if (e.key === "profile") {
      navigate("/profile");
    } else if (e.key === "logout") {
      setIsModalOpen(true);
    } else if (e.key === "change-password") {
      navigate("/changepassword");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick} style={{ margin: "10px 0px" }}>
      <Menu.Item key="profile">
        <Typography variant="body1">Profile</Typography>
      </Menu.Item>
      <Menu.Item key="logout" style={{ color: "red" }}>
        <Typography variant="body1">Logout</Typography>
      </Menu.Item>
      <Menu.Item key="change-password">
        <Typography variant="body1">Change Password</Typography>
      </Menu.Item>
    </Menu>
  );

  // Render selected section
  const renderSection = () => {
    switch (selectedSection) {
      case sections.dashboard:
        return <Typography variant="h4">Dashboard Content</Typography>;
      case sections.userManagement:
        return <UserManagment />;
      case sections.teamManagement:
        return <TeamManagment />;
      case sections.roles:
        return <Typography variant="h4">Roles Content</Typography>;
      case sections.projects:
        return <Typography variant="h4">Projects Content</Typography>;
      case sections.reports:
        return <Typography variant="h4">Reports Content</Typography>;
      default:
        return <Typography variant="h4">Dashboard Content</Typography>;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={() => setOpen(!open)} edge="start" sx={{ mr: 2, ...(open && { display: "none" }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap sx={{ flexGrow: 1 }}> Task Management System </Typography>
          <IconButton onClick={handleThemeChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar size="large" style={{ margin: "0px 15px" }} src={image} alt={username} />
          </Dropdown>
          <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
            <Typography variant="body1">{username}</Typography>
            <Typography variant="body2" color="textSecondary">
              {role}
            </Typography>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Drawer sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", }, }} variant="persistent" anchor="left" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <List>
          {Object.entries(sections).map(([key, value]) => (
            <ListItem button key={key} onClick={() => setSelectedSection(value)} sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                {key === "dashboard" && <DashboardIcon />}
                {key === "userManagement" && <GroupIcon />}
                {key === "teamManagement" && <GroupsIcon />}
                {key === "roles" && <SecurityIcon />}
                {key === "projects" && <AssignmentIcon />}
                {key === "reports" && <BarChartIcon />}
              </ListItemIcon>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {renderSection()}
      </Main>

      <Modal title="Confirm Logout" visible={isModalOpen} onOk={handleLogout} onCancel={handleCancel} okText="Logout" cancelText="Cancel">
        <p>Are you sure you want to logout?</p>
      </Modal>
    </ThemeProvider>
  );
}