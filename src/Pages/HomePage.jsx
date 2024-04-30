// Pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import { Button, styled } from "@mui/material";
import "../App.css";
import "../Components/xbutton.css";

const BlueButton = styled(Button)({
  backgroundColor: "blue",
  color: "#EEE",
  "&:hover": {
    backgroundColor: "#0288d1",
  },
});

const CenteredContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "25vh",
});

const HomePage = () => {
  const handleButtonClick = () => {
    // Handle button click event here
    console.log("Button clicked!");
  };

  return (
    <section className="hero">
      <div className="content">
        <h1>Be More Secure.</h1>
        <p>Monitoring Visually the EDR activity.</p>
        <div className="box-2">
          <div className="btn btn-two">
            <Button
              onClick={handleButtonClick}
              component={Link}
              to="/connected-clients"
              style={{ color: "white" }}
            >
              Go to Connected Clients Page
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
