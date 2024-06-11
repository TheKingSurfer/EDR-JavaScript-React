// ConnectedClients.js
import React from "react";
import { Container, Grid, Card, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ConnectedClients = ({ connectedClients }) => {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={4}>
        {connectedClients.map((client, index) => {
          console.log(connectedClients);

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
                  component={Link}
                  to={`/client/${ipAddress}/${port}`} // Navigate to client details page
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
