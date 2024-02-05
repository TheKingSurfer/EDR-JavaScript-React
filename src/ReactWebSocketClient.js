// ReactWebSocketClient.js
import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import WebSocket from "websocket";

const ReactWebSocketClient = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      setEvents((prevEvents) => [...prevEvents, eventData]);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Real-time Events
      </Typography>
      <List>
        {events.map((event, index) => (
          <ListItem key={index}>
            <ListItemText primary={event} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ReactWebSocketClient;
