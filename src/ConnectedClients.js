// ConnectedClients.js
import React from "react";
import { Container, Grid, Card, Typography, Button } from "@mui/material";

const ConnectedClients = ({ connectedClients }) => {
  const handleMoreDetails = (client) => {
    // Handle navigation or displaying more details for the selected client
    console.log("More details for client:", client);
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={4}>
        {connectedClients.map((client, index) => {
          // Split the client string into IP address and port number
          const [ipAddress, port] = client.split(":");

          return (
            <Grid item key={index}>
              <Card>
                <Typography gutterBottom variant="h5">
                  Connected Client
                </Typography>
                <Typography variant="body1" align="center" paragraph>
                  IP Address: {ipAddress}
                  <br />
                  Port Number: {port}
                </Typography>
                <Button
                  onClick={() => handleMoreDetails(client)}
                  variant="contained"
                  color="primary"
                >
                  More Details
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ConnectedClients;
