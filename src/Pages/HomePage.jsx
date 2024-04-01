// Pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { Button, styled } from "@mui/material";

const BlueButton = styled(Button)({
  backgroundColor: "blue",
  color: "#EEE",
  "&:hover": {
    backgroundColor: "lightblue",
  },
});

const CenteredContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "25vh",
});

const HomePage = () => {
  return (
    <CenteredContainer>
      <div>
        <h1>Welcome to the Home Page</h1>
        <BlueButton component={Link} to="/connected-clients">
          Go to Connected Clients Page
        </BlueButton>
      </div>
    </CenteredContainer>
  );
};

export default HomePage;
