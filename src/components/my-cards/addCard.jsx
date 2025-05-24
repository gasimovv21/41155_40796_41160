"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./style.scss";
import { handleAddNewCreditCard } from "@/actions/my-cards-action";
import { swalToast } from "@/helpers/swal";

  const AddCardModal = ({ show, onClose, userId, token, onAddSuccess}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = async () => {
    const result = await handleAddNewCreditCard(token, userId, cardNumber, expirationDate, cvv);

    if (result) {
        onAddSuccess?.();
        onClose();
        swalToast(`Your new card has been successfully added.`);
    } else {
        swalToast("Failed to save card information.");
    }
  };

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
              placeholder="Enter card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
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
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Card
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCardModal;