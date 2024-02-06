// App.js
import React, { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import MyAppBar from "./AppBar";
import MainContent from "./MainContent";
import ConnectedClients from "./ConnectedClients";

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
      <MyAppBar />
      <main>
        <MainContent />
        <ConnectedClients connectedClients={connectedClients} />
      </main>
    </>
  );
};

export default App;
