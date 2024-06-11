import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../App.css";

const ClientDetailsPage = () => {
  const { ip, port } = useParams();
  const [events, setEvents] = useState([]);
  const [connIp, setConnIp] = useState(null);
  const [connPort, setConnPort] = useState(null);

  useEffect(() => {
    const establishWebSocketConnection = () => {
      try {
        // Fetch the client's IP address
        fetch("https://api.ipify.org?format=json")
          .then((ipResponse) => ipResponse.json())
          .then((ipData) => setConnIp(ipData.ip))
          .then(() => {
            // Connect to WebSocket server
            const ws = new WebSocket("ws://localhost:8080/client-details-page");

            ws.onopen = () => {
              console.log(
                "WebSocket connection established to the more details page."
              );
              setConnPort(window.location.port);
              // Send handshake message to the server
              const handshakeMessage = JSON.stringify({
                page: "ClientDetailsPage",
                connIp: "62.90.52.113",
                connPort: 5050,
                clientIp: ip,
                clientPort: port,
              });
              ws.send(handshakeMessage);
            };

            ws.onmessage = (event) => {
              const dataArray = JSON.parse(event.data); // Parse the entire array

              // Iterate over each element in the array
              const uniqueEvents = new Set(events);

              // Iterate over each element in the array
              dataArray.forEach((data) => {
                console.log("Received data:", data);

                // Create a unique string representation of the event
                const eventString = JSON.stringify(data);
                if (eventString.includes("ExecutableHashCode")) {
                  if (!uniqueEvents.has(eventString)) {
                    // If it does not exist, add it to the set and update the state
                    uniqueEvents.add(eventString);
                    setEvents((prevEvents) => [...prevEvents, data]);
                  }

                  console.log("Events:", events); // Note: This might not show the updated state immediately due to closure
                }

                // Check if the event already exists in the set
              });
              // Update the events state with the new lines, avoiding duplicates
              // setEvents((prevEvents) => {
              //   const newEvents = [...prevEvents];
              //   eventDataLines.forEach((line) => {
              //     const trimmedLine = line.trim();
              //     if (trimmedLine && !newEvents.includes(trimmedLine)) {
              //       newEvents.push(trimmedLine);
              //     }
              //   });
              //   return newEvents;
              // });

              console.log(" all of the current Events:", events); // Note: This might not show the updated state immediately due to closure
            };
            ws.onclose = () => {
              console.log("WebSocket connection closed.");
            };

            return () => {
              // Close WebSocket connection when component unmounts
              ws.close();
            };
          });
      } catch (error) {
        console.error("Error establishing WebSocket connection:", error);
      }
    };

    establishWebSocketConnection();
  }, [connIp, connPort, ip, port]);

  return (
    <div>
      <div className="connectedClients"></div>
      <div className="clientDetailsContent">
        <h1>Client Details</h1>
        {connIp && <p>Connection IP Address: {connIp}</p>}
        {connPort && <p>Connection Port: {connPort}</p>}
        <p>IP Address: {ip}</p>
        <p>Port Number: {port}</p>
        <div>
          <Link to="/connected-clients">Back to Connected Clients</Link>
          <Link to={`/view-processes/${ip}/${port}`}>View Processes</Link>
        </div>
        {events.map((event, index) => (
          <Card
            key={index}
            sx={{ minWidth: 275 }}
            style={{
              color: "black",
              backgroundColor: "grey",
              marginBottom: "20px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                style={{ backgroundColor: "grey ", color: "black" }}
              >
                Event Details
              </Typography>
            </CardContent>
            <ul>
              {event.split("\n").map((line, lineIndex) => {
                const colonIndex = line.indexOf(":");
                if (colonIndex !== -1) {
                  const key = line.substring(0, colonIndex).trim();
                  const value = line.substring(colonIndex + 1).trim();
                  return (
                    <li key={lineIndex}>
                      <span>{key}: </span>
                      <span>{value}</span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientDetailsPage;
