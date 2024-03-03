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
              console.log(
                "WebSocket connection established to the more details page."
              );
              setConnPort(window.location.port);
              // Send handshake message to the server
              const handshakeMessage = JSON.stringify({
                page: "ClientDetailsPage",
                connIp: "62.90.52.113",
                connPort: 5050, // You can set the port if needed
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

                // Check if the event already exists in the set
                if (!uniqueEvents.has(eventString)) {
                  // If it does not exist, add it to the set and update the state
                  uniqueEvents.add(eventString);
                  setEvents((prevEvents) => [...prevEvents, data]);
                }

                console.log("Events:", events); // Note: This might not show the updated state immediately due to closure
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
      <div>
        {" "}
        <Link to={`/view-processes/${ip}/${port}`}>View Processes</Link>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
