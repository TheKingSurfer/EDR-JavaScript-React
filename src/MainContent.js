// MainContent.js
import React from "react";
import { Container, Typography } from "@mui/material";

const MainContent = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
        EDR
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        In this page, you will see the connected clients to the main server.
      </Typography>
    </Container>
  );
};

export default MainContent;
