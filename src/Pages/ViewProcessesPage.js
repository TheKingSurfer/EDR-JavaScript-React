import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const ViewProcessesPage = () => {
  const { ip, port } = useParams();
  const [connIp, setConnIp] = useState(null);
  const [connPort, setConnPort] = useState(null);
  const [processes, setProcesses] = useState([]);

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
                connIp: "62.90.52.113",
                connPort: 5050,
                clientIp: ip,
                clientPort: port,
              });
              ws.send(handshakeMessage);
            };

            ws.onmessage = (event) => {
              const receivedData = JSON.parse(event.data);
              // Assuming receivedData is an array of strings
              const parsedProcesses = parseData(receivedData);
              setProcesses(parsedProcesses);
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

  // Function to parse the array of strings into an array of objects
  const parseData = (data) => {
    const parsedProcesses = [];
    for (let i = 0; i < data.length; i += 3) {
      // Check if each element of the data array is defined before splitting
      if (data[i] && data[i + 1] && data[i + 2]) {
        parsedProcesses.push({
          EventName: data[i].split(": ")[1],
          ProcessId: data[i + 1].split(": ")[1],
          ParentProcessId: data[i + 2].split(": ")[1],
        });
      } else {
        console.error(
          "Invalid data format:",
          data[i],
          data[i + 1],
          data[i + 2]
        );
      }
    }
    return parsedProcesses;
  };

  // Function to determine row color based on event name
  const getRowColor = (eventName) => {
    switch (eventName) {
      case "someEventName":
        return "green"; // Change to the desired color
      case "anotherEventName":
        return "blue"; // Change to the desired color
      default:
        return "black"; // Default color
    }
  };

  return (
    <div>
      <h1>View Processes</h1>
      <Link to={`/client/${ip}/${port}`}>Back to Client Details</Link>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Parent Process ID</th>
            <th>Event Name</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index} style={{ color: getRowColor(process.EventName) }}>
              <td>{process.ProcessId}</td>
              <td>{process.ParentProcessId}</td>
              <td>{process.EventName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProcessesPage;
