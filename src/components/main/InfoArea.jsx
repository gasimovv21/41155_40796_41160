"use client";
import { Container, Card, Stack } from "react-bootstrap";
import "./info-area.scss";

export default function InfoArea() {
  return (
    <Container fluid className="info-area p-3">
      <Stack gap={3}>
        <Card className="info-card card-bg-light">
          <Card.Body>
            <Card.Title className="card-title">
              Welcome to Currency Web
            </Card.Title>
            <Card.Text className="card-text">
              Here you can track currency exchange rates in real time. Use the
              selector to choose between PLN, USD, or EUR and visualize their
              historical trends.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="info-card card-bg-white">
          <Card.Body>
            <Card.Title className="card-title">Features</Card.Title>
            <Card.Text className="card-text">
              ✓ Real-time chart updates
              <br />
              ✓ Clean and simple interface
              <br />
              ✓ React + Chart.js + Bootstrap stack
              <br />✓ Built with Next.js
            </Card.Text>
          </Card.Body>
        </Card>
      </Stack>
    </Container>
  );
}
