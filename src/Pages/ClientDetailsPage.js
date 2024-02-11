import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ClientDetailsPage = () => {
  const { ip, port } = useParams();
  const [events, setEvents] = useState([]);
  const [connIp, setConnIp] = useState(null);
  const [connPort, setConnPort] = useState(null);

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      try {
        // Fetch the client's IP address
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setConnIp(ipData.ip);

        // Fetch the server's port number from an API
        const portResponse = await fetch("/api/port");
        const portData = await portResponse.json();
        setConnPort(portData.port); // this is where it crashes

        // if (connIp && connPort) {
        // Fetch to establish WebSocket connection
        const wsInitResponse = await fetch(
          "http://localhost:8080/client-details-page",
          {
            //            method: "POST", // or "GET"
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              page: "ClientDetailsPage",
              connIp: connIp,
              connPort: connPort,
              clientIp: ip,
              clientPort: port,
            }),
          }
        );

        if (wsInitResponse.ok) {
          console.log("WebSocket connection established.");
          console.log(`response succeded ${wsInitResponse}`);
          const ws = new WebSocket("ws://localhost:8080/client-details-page");
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.page === "ClientDetailsPage") {
              // Process incoming events only if they're relevant to this page
              setEvents((prevEvents) => [...prevEvents, data.event]);
            }
          };

          return () => {
            // Send handshake message to the server when component unmounts
            const handshakeMessage = JSON.stringify({
              page: "MainContent",
              connIp: connIp,
              connPort: connPort,
            });
            ws.send(handshakeMessage);
            ws.close();
          };
        } else {
          throw new Error(
            `Failed to establish WebSocket connection On the ClientDetailsPage. ${Error}`
          );
        }
        //}
      } catch (error) {
        console.error("Error fetching connection info:", error);
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
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
      <Link to="/connected-clients">Back to Connected Clients</Link>
    </div>
  );
};

export default ClientDetailsPage;
