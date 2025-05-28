"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./style.scss";
import { handleAddNewCreditCard } from "@/actions/my-cards-action";
import { swalToast } from "@/helpers/swal";

const AddCardModal = ({ show, onClose, userId, token, onAddSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16); // only digits, max 16
    // group digits in 4s
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3); // only digits, max 3
    setCvv(value);
  };

  const handleSubmit = async () => {
    const plainCardNumber = cardNumber.replace(/\s/g, ""); // remove spaces before sending

    const result = await handleAddNewCreditCard(token, userId, plainCardNumber, expirationDate, cvv);

    if (result) {
      onAddSuccess?.();
      onClose();
      swalToast(`Your new card has been successfully added.`);
    } else {
      swalToast("Failed to save card information.");
    }
  };

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(expirationDate) &&
    cvv.length === 3;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="sm"
      backdrop="static"
      className="nested-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Credit Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="MM/YY"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CVV</Form.Label>
            <Form.Control
              type="password"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Save Card
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCardModal;