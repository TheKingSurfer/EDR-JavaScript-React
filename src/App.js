// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import MyAppBar from "./AppBar";
import MainContent from "./MainContent";
import ConnectedClients from "./ConnectedClients";
import HomePage from "./Pages/HomePage";
import ConnectedClientsPage from "./Pages/ConnectedClientsPage";
import ServerOfflineMessage from "./ServerOfflineMessage";
import ClientDetailsPage from "./Pages/ClientDetailsPage";

const App = () => {
  const [connectedClients, setConnectedClients] = useState([]);
  const [isServerOnline, setIsServerOnline] = useState(true);

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket("ws://localhost:8080/");

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsServerOnline(true);
        fetchConnectedClients(); // Fetch connected clients when server is online
      };

      ws.onmessage = (event) => {
        const newEvent = event.data;
        setConnectedClients((prevClients) => [...prevClients, newEvent]);
      };

      ws.onclose = () => {
        console.log("Connection closed");
        setIsServerOnline(false);
        setConnectedClients([]); // Clear connected clients when server is offline
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 10000); // Reconnect after 10 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const fetchConnectedClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/connected-clients");
      const clients = await response.json();
      setIsServerOnline(true);
      setConnectedClients(clients);
      console.log("Connected clients:", clients);
    } catch (error) {
      console.error("Error fetching connected clients:", error);
    }
    setInterval(fetchConnectedClients, 5000);
  };

  return (
    <Router>
      <CssBaseline />
      <MyAppBar />
      <Routes>
        <Route
          path="/"
          element={<HomePage isServerOnline={isServerOnline} />}
        />
        <Route
          path="/main"
          element={<MainContent isServerOnline={isServerOnline} />}
        />
        <Route
          path="/connected-clients"
          element={
            <ConnectedClientsPage
              connectedClients={connectedClients}
              isServerOnline={isServerOnline}
            />
          }
        />
        <Route path="/client/:ip/:port" element={<ClientDetailsPage />} />{" "}
        {/* Add new route for client details */}
      </Routes>
      {/* {!isServerOnline && <ServerOfflineMessage />}{" "}
      Render error message if server is offline */}
    </Router>
  );
};

export default App;
