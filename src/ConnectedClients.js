// ConnectedClients.js
import React from "react";
import { Container, Grid, Card, Typography } from "@mui/material";

const ConnectedClients = ({ connectedClients }) => {
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ConnectedClients;