// AppBar.js
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const MyAppBar = () => {
  return (
    <AppBar position="relative">
      <Toolbar>
        <PhotoCamera />
        <Typography variant="h6"> EDR</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
