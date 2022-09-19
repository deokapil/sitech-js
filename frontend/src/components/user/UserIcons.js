import React from "react";
import { Mail, Notifications } from "@mui/icons-material";
import { Badge, Box, IconButton } from "@mui/material";

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
    </Box>
  );
};

export default UserIcons;
