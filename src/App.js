import React, { useEffect, useState } from "react";
import { Typography, Container } from "@mui/material";

const App = () => {
  const [events, setEvents] = useState([]);
  const [connectedClients, setConnectedClients] = useState([]);

  useEffect(() => {
    // Install 'websocket' package using 'npm install websocket'
    const WebSocket = require("websocket").w3cwebsocket;

    const ws = new WebSocket("ws://localhost:8080/");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const newEvent = event.data;
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    ws.onclose = () => {
      console.log("Connection closed");
    };

    // Fetch connected clients when the component mounts
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
    } catch (error) {
      console.error("Error fetching connected clients:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Real-Time Events
      </Typography>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>

      <Typography variant="h5" gutterBottom>
        Connected Clients
      </Typography>
      <ul>
        {connectedClients.map((client, index) => (
          <li key={index}>{client}</li>
        ))}
      </ul>
    </Container>
  );
};

export default App;
