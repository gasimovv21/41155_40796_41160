"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import {
  Row,
  Col,
  Form,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { handleGetChartData } from "@/actions/main-action";

const ChartArea = () => {
  const [fromCurrency, setFromCurrency] = useState("PLN");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rateType, setRateType] = useState("SELL"); // State for BUY/SELL toggle
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState({
    labels: Array(10).fill(""),
    datasets: [
      {
        label: `${fromCurrency} / ${toCurrency}`,
        data: Array(10).fill(0),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  });

  // Function to fetch chart data and update the chart
  const fetchChartData = async () => {
    const data = await handleGetChartData(toCurrency.toLowerCase()); // Pass the correct currency code to the API
    if (data && data.rates) {
      const values = data.rates.map(
        (item) => (rateType === "BUY" ? item.ask : item.bid) // Select ask for BUY, bid for SELL
      );
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: values,
          },
        ],
      }));
    }
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
        maintainAspectRatio: false, // Important: allows us to control the height
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: false, // Prevents starting at zero
            ticks: {
              min: Math.min(...chartData.datasets[0].data) - 0.1, // Slightly lower than the lowest data value
              max: Math.max(...chartData.datasets[0].data) + 0.1, // Slightly higher than the highest data value
              stepSize: 0.05, // Adjust step size based on your data precision
            },
            type: "linear",
          },
        },
      },
    });
  }, [chartData]); // Recreate the chart if chartData changes

  useEffect(() => {
    fetchChartData(); // Fetch chart data when component mounts or when currencies or rate type change
  }, [fromCurrency, toCurrency, rateType]);

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
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Form.Select>
        </Col>
        <Col xs={6}>
          <Form.Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col xs={12}>
          <ToggleButtonGroup
            type="radio"
            name="rateType"
            value={rateType}
            onChange={(value) => setRateType(value)}
          >
            <ToggleButton id="buy-toggle" value="BUY" variant="outline-primary">
              Buy
            </ToggleButton>
            <ToggleButton
              id="sell-toggle"
              value="SELL"
              variant="outline-primary"
            >
              Sell
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </>
  );
};

export default ChartArea;
