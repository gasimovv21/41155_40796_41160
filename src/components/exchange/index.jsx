"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import "./style.scss";
import { swalToast } from "@/helpers/swal";
import {
  handleExchangeRequest,
  handleCurrencyRateFetch,
} from "@/actions/exchange-action";
import ExchangeForm from "../common/exchange-form/ExchangeForm";
import { currencyList } from "@/helpers/currencyList";

const ExchangeModal = ({ show, onHide, userId, token, onExchangeSuccess }) => {
  const [visualAmount1, setVisualAmount1] = useState("");
  const [visualAmount2, setVisualAmount2] = useState("");
  const [realAmount1, setRealAmount1] = useState(null);
  const [realAmount2, setRealAmount2] = useState(null);
  const [mode, setMode] = useState("buy");
  const [input1Currency, setInput1Currency] = useState("EUR");
  const [showCurrencyPickDropdown, setShowCurrencyPickDropdown] =
    useState(false);
  const [rates, setRates] = useState({ ask: 0, bid: 0 });
  const [error, setError] = useState("");

  const isBuying = mode === "buy";
  const currentRate = isBuying ? rates.ask : rates.bid;

  useEffect(() => {
    const fetchRates = async () => {
      const result = await handleCurrencyRateFetch(
        input1Currency.toLowerCase()
      );
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
      const convertedValue =
        parseFloat(formattedValue) * parseFloat(currentRate);
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

    const result = await handleExchangeRequest(
      userId,
      token,
      from_currency,
      to_currency,
      amount
    );
    if (result.error) {
      swalToast(result.error);
    } else {
      if (isBuying) {
        swalToast(
          `You have successfully converted ${numericAmount2.toFixed(2)} ${from_currency} to ${numericAmount1.toFixed(2)} ${to_currency}.`
        );
      } else {
        swalToast(
          `You have successfully converted ${numericAmount1.toFixed(2)} ${from_currency} to ${numericAmount2.toFixed(2)} ${to_currency}.`
        );
      }
      onExchangeSuccess?.();
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="exchange-modal"
    >
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
                <ToggleButton
                  id="buy-toggle"
                  value="buy"
                  variant="outline-primary"
                >
                  Buy
                </ToggleButton>
                <ToggleButton
                  id="sell-toggle"
                  value="sell"
                  variant="outline-primary"
                >
                  Sell
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="rate-box">
              <div>
                Buy: <strong>{rates.ask}</strong>
              </div>
              <div>
                Sell: <strong>{rates.bid}</strong>
              </div>
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <ExchangeForm
          isBuying={isBuying}
          visualAmount1={visualAmount1}
          visualAmount2={visualAmount2}
          handleAmount1Change={handleAmount1Change}
          handleAmount2Change={handleAmount2Change}
          input1Currency={input1Currency}
          currencyList={currencyList}
          showCurrencyPickDropdown={showCurrencyPickDropdown}
          setShowCurrencyPickDropdown={setShowCurrencyPickDropdown}
          setInput1Currency={setInput1Currency}
          error={error}
        />
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant="primary"
          onClick={handleExchange}
          disabled={
            !!error ||
            parseFloat(realAmount1) < 1 ||
            parseFloat(realAmount2) < 1
          }
        >
          Exchange
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExchangeModal;
