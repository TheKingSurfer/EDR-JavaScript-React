// Pages/ConnectedClientsPage.js
import React from "react";
import { Link } from "react-router-dom";
import ConnectedClients from "../ConnectedClients";
import ServerOfflineMessage from "../ServerOfflineMessage";
import "../App.css";

const ConnectedClientsPage = ({ connectedClients, isServerOnline }) => {
  return (
    <div>
      <div className="connectedClients"></div>
      <div className="connectedClientsContent">
        <h1>Connected Clients Page</h1>
        {!isServerOnline && <ServerOfflineMessage />}
        {/* Render error message if server is offline */}
        <ConnectedClients connectedClients={connectedClients} />
        <Link to="/">Go back to Home Page</Link>
      </div>
    </div>
  );
};

export default ConnectedClientsPage;
