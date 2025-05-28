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
              Track, deposit, and exchange currencies effortlessly.
              Stay in control of your money with real-time data and secure card management — all in one place.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="info-card card-bg-white">
          <Card.Body>
            <Card.Title className="card-title">Features</Card.Title>
            <Card.Text className="card-text">
              Add credit cards, view balances, deposit funds, and monitor your transaction history. Start now and take charge of your finances.
              <br />
              ✓ Clean and simple interface
              <br />
              ✓ Fast and secure transactions
              <br />
              ✓ Up-to-date market values
            </Card.Text>
          </Card.Body>
        </Card>
      </Stack>
    </Container>
  );
}
