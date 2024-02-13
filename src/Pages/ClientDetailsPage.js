import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

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
              console.log("WebSocket connection established.");
              // Send handshake message to the server
              const handshakeMessage = JSON.stringify({
                page: "ClientDetailsPage",
                connIp: connIp,
                connPort: connPort, // You can set the port if needed
                clientIp: ip,
                clientPort: port,
              });
              ws.send(handshakeMessage);
            };

            ws.onmessage = (event) => {
              const data = JSON.parse(event.data)[0]; // Access the string element within the array
              console.log("Received data:", data);

              // Split the string into lines
              const eventDataLines = data.split("\n");

              // Update the events state with the new lines, avoiding duplicates
              setEvents((prevEvents) => {
                const newEvents = [...prevEvents];
                eventDataLines.forEach((line) => {
                  if (!newEvents.includes(line)) {
                    newEvents.push(line);
                  }
                });
                return newEvents;
              });

              console.log("Events:", events); // Note: This might not show the updated state immediately due to closure
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
      <h1>Client Details</h1>
      {connIp && <p>Connection IP Address: {connIp}</p>}
      {connPort && <p>Connection Port: {connPort}</p>}
      <p>IP Address: {ip}</p>
      <p>Port Number: {port}</p>
      <ul>
        {events.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
      <Link to="/connected-clients">Back to Connected Clients</Link>
    </div>
  );
};

export default ClientDetailsPage;
