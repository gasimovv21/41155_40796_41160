"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Image from "next/image";
import "./style.scss";
import { swalToast } from "@/helpers/swal";
import { handleExchangeRequest, handleCurrencyRateFetch } from "@/actions/exchange-action";

const ExchangeModal = ({ show, onHide, userId, token }) => {
  const [visualAmount1, setVisualAmount1] = useState("");
  const [visualAmount2, setVisualAmount2] = useState("");
  const [realAmount1, setRealAmount1] = useState(null);
  const [realAmount2, setRealAmount2] = useState(null);
  const [mode, setMode] = useState("buy");
  const [input1Currency, setInput1Currency] = useState("EUR");
  const [showCurrencyPickDropdown, setShowCurrencyPickDropdown] = useState(false);
  const [rates, setRates] = useState({ ask: 0, bid: 0 });
  const [error, setError] = useState("");

  const isBuying = mode === "buy";
  const currentRate = isBuying ? rates.ask : rates.bid;

  const currencyList = [
    { code: "USD", label: "USD", flag: "/icons/flags/usd.svg" },
    { code: "EUR", label: "EUR", flag: "/icons/flags/eur.svg" },
    { code: "GBP", label: "GBP", flag: "/icons/flags/gbp.svg" },
    { code: "JPY", label: "JPY", flag: "/icons/flags/jpy.svg" },
    { code: "CAD", label: "CAD", flag: "/icons/flags/cad.svg" },
    { code: "AUD", label: "AUD", flag: "/icons/flags/aud.svg" },
    { code: "CHF", label: "CHF", flag: "/icons/flags/chf.svg" },
    { code: "SEK", label: "SEK", flag: "/icons/flags/sek.svg" },
  ];

  useEffect(() => {
    const fetchRates = async () => {
      const result = await handleCurrencyRateFetch(input1Currency.toLowerCase());
      if (result && result.rates && result.rates.length > 0) {
        const latest = result.rates[result.rates.length - 1];
        setRates({ ask: latest.ask, bid: latest.bid });
      }
    };
    fetchRates();
  }, [input1Currency]);

  useEffect(() => {
    setVisualAmount1("");
    setVisualAmount2("");
    setError("");
  }, [input1Currency, mode]);

  const handleAmount1Change = (value) => {
    const formattedValue = value.replace(",", ".");
    const regex = /^\d*(\.\d{0,2})?$/;
    if (!regex.test(formattedValue)) return;

    setVisualAmount1(formattedValue);
    if (parseFloat(formattedValue) < 1) {
      setError("Minimum amount is 1,00");
    } else {
      setError("");
    }

    if (formattedValue) {
      const convertedValue = parseFloat(formattedValue) * parseFloat(currentRate);
      setRealAmount1(value);
      setRealAmount2(convertedValue);
      setVisualAmount2(convertedValue.toFixed(2));
    } else {
      setVisualAmount2("");
      setRealAmount2("");
    }
  };

  const handleAmount2Change = (value) => {  
    const formattedValue = value.replace(",", ".");
    const regex = /^\d*(\.\d{0,2})?$/;
    if (!regex.test(formattedValue)) return;

    setVisualAmount2(formattedValue);
    if (formattedValue) {
      const convertedValue =
        parseFloat(formattedValue) / parseFloat(currentRate);
        setRealAmount1(convertedValue);
        setRealAmount2(value);
        setVisualAmount1(convertedValue.toFixed(2));
        if (parseFloat(convertedValue.toFixed(2)) < 1) {
          setError("Minimum amount is 1,00");
        } else {
          setError("");
        }
      } else {
        setVisualAmount1("");
        setRealAmount2("");
      }
  };

  const handleExchange = async () => {
    const numericAmount1 = parseFloat(realAmount1);
    const numericAmount2 = parseFloat(realAmount2);

    if (realAmount1 < 1 || realAmount2 < 1) return;
    const from_currency = isBuying ? "PLN" : input1Currency;
    const to_currency = isBuying ? input1Currency : "PLN";
    const amount = isBuying ? numericAmount2 : numericAmount1;

    const result = await handleExchangeRequest(userId, token, from_currency, to_currency, amount);
      if (result.error) {
        swalToast(result.error);
      } else {
        onHide();
      }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="exchange-modal">
      <Modal.Header closeButton className="align-items-start">
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h5 className="modal-title">Currency Exchange</h5>
              <ToggleButtonGroup
                type="radio"
                name="mode"
                value={mode}
                onChange={(val) => setMode(val)}
              >
                <ToggleButton id="buy-toggle" value="buy" variant="outline-primary">
                  Buy
                </ToggleButton>
                <ToggleButton id="sell-toggle" value="sell" variant="outline-primary">
                  Sell
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="rate-box">
              <div>Buy: <strong>{rates.ask}</strong></div>
              <div>Sell: <strong>{rates.bid}</strong></div>
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{isBuying ? "You are buying" : "You will sell"}</Form.Label>
            <div className="exchange-input">
              <Form.Control
                type="text"
                value={visualAmount1}
                onChange={(e) => handleAmount1Change(e.target.value)}
                placeholder="Enter amount"
              />
              <div
                className="currency-box"
                onClick={() => setShowCurrencyPickDropdown(!showCurrencyPickDropdown)}
              >
                <Image
                  src={currencyList.find((c) => c.code === input1Currency)?.flag}
                  alt={input1Currency}
                  width={24}
                  height={16}
                />
                <span className="ms-2">
                  {currencyList.find((c) => c.code === input1Currency)?.label}
                </span>
                <span className="arrow">▾</span>

                {showCurrencyPickDropdown && (
                  <div className="currency-dropdown fade-slide-in">
                    {currencyList.map((item) => (
                      <div
                        key={item.code}
                        className="currency-option"
                        onClick={() => {
                          setInput1Currency(item.code);
                          setShowCurrencyPickDropdown(false);
                        }}
                      >
                        <Image src={item.flag} alt={item.code} width={24} height={16} />
                        <span className="ms-2">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mt-4">
            <Form.Label>{isBuying ? "You will pay" : "You will get"}</Form.Label>
            <div className="exchange-input">
              <Form.Control
                type="text"
                value={visualAmount2}
                onChange={(e) => handleAmount2Change(e.target.value)}
                placeholder="Enter amount"
              />
              <div className="currency-box disabled">
                <Image src="/icons/flags/pln.svg" alt="PLN" width={24} height={16} />
                <span className="ms-2">PLN</span>
              </div>
            </div>
          </Form.Group>

          {error && (
            <div className="text-danger mt-3 text-center">
              <strong>{error}</strong>
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant="primary"
          onClick={handleExchange}
          disabled={!!error || parseFloat(realAmount1) < 1 || parseFloat(realAmount2) < 1}
        >
          Exchange
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExchangeModal;