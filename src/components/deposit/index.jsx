"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./style.scss";
import { handleDepositAction } from "@/actions/deposit-action";

const DepositModal = ({ show, onClose, currencyCode, userId, token, onDepositSuccess }) => {
  const [depositAmount, setDepositAmount] = useState("");

  const handleInputChange = (e) => {
    const formattedValue = e.target.value.replace(",", ".");
    setDepositAmount(formattedValue);
  };

  const handleDeposit = async () => {
    const result = await handleDepositAction(userId, token, currencyCode, depositAmount);
    if (result) {
      console.log("Deposit successful:", result);
      onDepositSuccess?.();
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="deposit-modal">
      <Modal.Header closeButton>
        <Modal.Title>Deposit Money</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted text-center mb-4">
          You are depositing into your <strong>{currencyCode}</strong> account.
        </p>

        <Form.Group className="mb-3" controlId="depositAmount">
          <Form.Label>Deposit Amount ({currencyCode})</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="any"
            placeholder={`Enter deposit amount in ${currencyCode}`}
            value={depositAmount}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button className="deposit-button w-100" onClick={handleDeposit}>
          Deposit
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DepositModal;