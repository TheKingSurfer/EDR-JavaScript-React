import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  AppBar,
  Card,
  CssBaseline,
  Grid,
  Toolbar,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const App = () => {
  const [connectedClients, setConnectedClients] = useState([]);

  useEffect(() => {
    const WebSocket = require("websocket").w3cwebsocket;

    const ws = new WebSocket("ws://localhost:8080/");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const newEvent = event.data;
      setConnectedClients((prevClients) => [...prevClients, newEvent]);
    };

    ws.onclose = () => {
      console.log("Connection closed");
    };

    fetchConnectedClients();

    return () => {
      ws.close();
    };
  }, []);

  const fetchConnectedClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/connected-clients");
      const clients = await response.json();
      setConnectedClients(clients);
      console.log("Connected clients:", clients);
    } catch (error) {
      console.error("Error fetching connected clients:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <PhotoCamera />
          <Typography variant="h6"> EDR</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="sm">
          <Typography
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            EDR
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            In this page, you will see the connected clients to the main server.
          </Typography>
        </Container>
        <Container maxWidth="sm">
          <Grid container spacing={4}>
            {connectedClients.map((client, index) => {
              // Split the client string into IP address and port number
              const [ipAddress, port] = client.split(":");

              return (
                <Grid item key={index}>
                  <Card>
                    <Typography gutterBottom variant="h5">
                      Connected Client
                    </Typography>
                    <Typography variant="body1" align="center" paragraph>
                      IP Address: {ipAddress}
                      <br />
                      Port Number: {port}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default App;
