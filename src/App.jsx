// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button, CssBaseline } from "@mui/material";
import MyAppBar from "./AppBar"; // this is the bar
import MainContent from "./Components/MainContent";
import ConnectedClients from "./Components/ConnectedClients";
import HomePage from "./Pages/HomePage";
import ConnectedClientsPage from "./Pages/ConnectedClientsPage";
import ServerOfflineMessage from "./Components/ServerOfflineMessage";
import ClientDetailsPage from "./Pages/ClientDetailsPage";
import ViewProcessesPage from "./Pages/ViewProcessesPage";
import styled from "@emotion/styled";
import "./App.css";
import Image from "./Images/main.jpg";

const App = () => {
  const [connectedClients, setConnectedClients] = useState([]);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const BlueButton = styled(Button)({
    backgroundColor: "skyblue",
    color: "#888",
    margin: 5,
    "&:hover": {
      backgroundColor: "lightblue",
    },
  });
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
        const newData = JSON.parse(event.data); // Parse the received JSON data
        setConnectedClients(newData); // Update connectedClients state with the received data
        console.log("Connected clients:", newData);
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
  };
  //style={{backgroundImage: `url(${Image})`, backgroundSize: 'cover',backgroundRepeat: 'no-repeat',height:"100vh"}}
  return (
    <section>
      <Router>
        <CssBaseline />

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
          <Route
            path="/view-processes/:ip/:port"
            element={<ViewProcessesPage />}
          />
        </Routes>
      </Router>
    </section>
  );
};

export default App;
