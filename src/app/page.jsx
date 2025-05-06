"use client";
import TopBar from "@/components/main/TopBar";
import ChartArea from "@/components/main/ChartArea";
import InfoArea from "@/components/main/InfoArea";
import { Container, Row, Col } from "react-bootstrap";
import "./style.scss";
import ExchangeTicker from "@/components/main/ExchangeTicker";

export default function Home() {
  return (
    <>
      <div className="page-wrapper">
        <div className="card-container">
          <Container fluid className="bg-white rounded shadow">
            <Row>
              <TopBar />
              <ExchangeTicker />
            </Row>
            <Row>
              <Col lg={8} md={12} className="mb-4">
                <ChartArea />
              </Col>
              <Col lg={4} md={12}>
                <InfoArea />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
