import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ViewProcessesPage = () => {
  const { ip, port } = useParams();
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
            const ws = new WebSocket("ws://localhost:8080/view-processes-page");

            ws.onopen = () => {
              console.log(
                "WebSocket connection established to the View Processes page."
              );
              setConnPort(window.location.port);
              // Send handshake message to the server
              const handshakeMessage = JSON.stringify({
                page: "ViewProcessesPage",
                connIp: connIp,
                connPort: connPort,
                clientIp: ip,
                clientPort: port,
              });
              ws.send(handshakeMessage);
            };

            ws.onmessage = (event) => {
              console.log("Received data:", event.data);
              // Handle the received data here
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
      <h1>View Processes</h1>
      <Link to={`/client/${ip}/${port}`}>Back to Client Details</Link>
    </div>
  );
};

export default ViewProcessesPage;
