// components/ExchangeForm.jsx
import React from "react";
import { Form } from "react-bootstrap";
import Image from "next/image";

const ExchangeForm = ({
  isBuying,
  visualAmount1,
  visualAmount2,
  handleAmount1Change,
  handleAmount2Change,
  input1Currency,
  currencyList,
  showCurrencyPickDropdown,
  setShowCurrencyPickDropdown,
  setInput1Currency,
  error,
}) => {
  return (
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
            onClick={() =>
              setShowCurrencyPickDropdown(!showCurrencyPickDropdown)
            }
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
                    <Image
                      src={item.flag}
                      alt={item.code}
                      width={24}
                      height={16}
                    />
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
            <Image
              src="/icons/flags/pln.svg"
              alt="PLN"
              width={24}
              height={16}
            />
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
  );
};

export default ExchangeForm;
