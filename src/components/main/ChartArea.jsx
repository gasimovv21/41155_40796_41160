"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Row, Col, Form } from "react-bootstrap";

const ChartArea = () => {
  const [fromCurrency, setFromCurrency] = useState("PLN");
  const [toCurrency, setToCurrency] = useState("USD");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const chartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: `${fromCurrency} / ${toCurrency}`,
        data: [4.2, 5.1, 6.3, 5.9, 6.5, 7.0],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false, // ÖNEMLİ: yüksekliği kontrol etmemizi sağlar
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            type: "linear",
          },
        },
      },
    });
  }, [fromCurrency, toCurrency]);

  return (
    <>
      <div style={{ height: "300px", position: "relative" }}>
        <canvas ref={chartRef} />
      </div>

      <Row className="mt-3">
        <Col xs={6}>
          <Form.Select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="PLN">PLN </option>
            <option value="USD">USD </option>
            <option value="EUR">EUR </option>
          </Form.Select>
        </Col>
        <Col xs={6}>
          <Form.Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="USD">USD </option>
            <option value="PLN">PLN </option>
            <option value="EUR">EUR </option>
          </Form.Select>
        </Col>
      </Row>
    </>
  );
};

export default ChartArea;
