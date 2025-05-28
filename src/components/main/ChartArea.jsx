"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Row, Col, Form, ToggleButton, ToggleButtonGroup, Dropdown } from "react-bootstrap";
import { handleGetChartData } from "@/actions/main-action";
import { currencyList } from "@/helpers/currencyList";
import Image from "next/image";
import "./ChartArea.scss";

const ChartArea = () => {
  const [fromCurrency, setFromCurrency] = useState("PLN");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rateType, setRateType] = useState("SELL");
  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [currentRate, setCurrentRate] = useState(0);
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

  const fetchChartData = async () => {
    const data = await handleGetChartData(toCurrency.toLowerCase());
    if (data && data.rates) {
      const values = data.rates.map((item) =>
        rateType === "BUY" ? item.ask : item.bid
      );
      const latestRate =
        rateType === "BUY"
          ? data.rates[data.rates.length - 1].ask
          : data.rates[data.rates.length - 1].bid;
      setCurrentRate(latestRate);
  
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: values,
            label: `${fromCurrency} / ${toCurrency}`,
          },
        ],
      }));
    }
  };  

  useEffect(() => {
    fetchChartData();
    setLeftInput("");
    setRightInput("");
  }, [toCurrency, rateType]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              min: Math.min(...chartData.datasets[0].data) - 0.1,
              max: Math.max(...chartData.datasets[0].data) + 0.1,
              stepSize: 0.05,
            },
            type: "linear",
          },
        },
      },
    });
  }, [chartData]);

  const handleLeftChange = (e) => {
    const value = parseFloat(e.target.value);
    setLeftInput(e.target.value);
    if (!isNaN(value)) {
      setRightInput((value * currentRate).toFixed(2));
    } else {
      setRightInput("");
    }
  };

  const handleRightChange = (e) => {
    const value = parseFloat(e.target.value);
    setRightInput(e.target.value);
    if (!isNaN(value)) {
      setLeftInput((value / currentRate).toFixed(2));
    } else {
      setLeftInput("");
    }
  };

  return (
    <>
      <Dropdown className="currencySelect">
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-custom-components">
          {toCurrency ? (
            <div className="d-flex align-items-center">
              <Image
                src={currencyList.find((c) => c.code === toCurrency)?.flag}
                alt={toCurrency}
                width={24}
                height={16}
              />
              <span className="ms-2">
                {currencyList.find((c) => c.code === toCurrency)?.label}
              </span>
            </div>
          ) : (
            "Select a currency"
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {currencyList.map((currency) => (
            <Dropdown.Item
              key={currency.code}
              onClick={() => setToCurrency(currency.code)}
            >
              <div className="d-flex align-items-center">
                <Image src={currency.flag} alt={currency.code} width={24} height={16} />
                <span className="ms-2">{currency.label}</span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div style={{ height: "300px", position: "relative" }}>
        <canvas ref={chartRef} />
      </div>

      <Row className="mt-3">
        <Col xs={6}>
          <ToggleButtonGroup
            className="toggleSwitch"
            type="radio"
            name="rateType"
            value={rateType}
            onChange={(value) => setRateType(value)}
          >
            <ToggleButton id="buy-toggle" value="BUY" variant="outline-primary">
              Buy
            </ToggleButton>
            <ToggleButton id="sell-toggle" value="SELL" variant="outline-primary">
              Sell
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col xs={6}>
          <div className="text-muted small mt-1">
            {rateType === "BUY" ? `If you buy (${toCurrency})` : `If you sell (${toCurrency})`}
          </div>
          <Form.Control
            type="number"
            placeholder={`Enter currency (${toCurrency})`}
            value={leftInput}
            onChange={handleLeftChange}
          />
        </Col>
        <Col xs={6}>
          <div className="text-muted small mt-1">
            {rateType === "BUY" ? "You pay (PLN)" : "You will get (PLN)"}
          </div>
          <Form.Control
            type="number"
            placeholder={`Enter currency (PLN)`} 
            value={rightInput}
            onChange={handleRightChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default ChartArea;