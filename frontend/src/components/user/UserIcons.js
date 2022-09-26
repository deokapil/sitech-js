import React from "react";
import { Mail, Notifications } from "@mui/icons-material";
import { Badge, Box, IconButton, Link, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const UserIcons = () => {
  return (
    <Box>
      <IconButton size="large" color="inherit">
        <Badge color="error" badgeContent={5}>
          <Mail />
        </Badge>
      </IconButton>
      <IconButton size="large" color="inherit">
        <Badge color="error" badgeContent={20}>
          <Notifications />
        </Badge>
      </IconButton>
      <Button
        component={RouterLink}
        to="/dashboard"
        variant="contained"
        color="secondary"
        sx={{ ml: 2 }}
      >
        Dashboard
      </Button>
    </Box>
  );
};

export default UserIcons;
