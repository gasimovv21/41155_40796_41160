"use client";
import React, { useState } from "react";
import { Modal, Form, Button, Dropdown } from "react-bootstrap";
import Image from "next/image";
import { handleAddAccount } from "@/actions/add-account-action";
import "./style.scss";

const AddAccountModal = ({ show, onClose, userId, token, onAddSuccess }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [error, setError] = useState("");

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

  const handleSubmit = async () => {
    if (!selectedCurrency) {
      setError("Please select a currency.");
      return;
    }

    const result = await handleAddAccount(token, selectedCurrency.code, userId);

    if (result) {
      onAddSuccess?.();
      onClose();
      setSelectedCurrency(null);
      setError("");
    } else {
      setError("Failed to add account. You may already have this currency.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" className="add-account-modal">
      <Modal.Header closeButton className="align-items-start">
        <div className="w-100">
          <h5 className="modal-title">Add New Account</h5>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3 text-center">
            <Form.Label>Select Currency</Form.Label>
            <div className="d-flex justify-content-center">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-custom-components">
                  {selectedCurrency ? (
                    <div className="d-flex align-items-center">
                      <Image src={selectedCurrency.flag} alt={selectedCurrency.code} width={24} height={16} />
                      <span className="ms-2">{selectedCurrency.label}</span>
                    </div>
                  ) : (
                    "Select a currency"
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {currencyList.map((currency) => (
                    <Dropdown.Item
                      key={currency.code}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setError("");
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <Image src={currency.flag} alt={currency.code} width={24} height={16} />
                        <span className="ms-2">{currency.label}</span>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
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
          onClick={handleSubmit}
          disabled={!selectedCurrency}
        >
          Add Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAccountModal;