"use client";
import React, { useEffect, useState, startTransition } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./style.scss";
import { swalToast } from "@/helpers/swal";
import { handleDepositAction } from "@/actions/deposit-action";
import { getCreditCardsData } from "@/actions/my-cards-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";

const DepositModal = ({ show, onClose, currencyCode, userId, token, onDepositSuccess }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCardId, setSelectedCardId] = useState("");
  const [state, dispatch] = useActionState(getCreditCardsData, initialResponse);

  useEffect(() => {
    if (show && userId && token) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("token", token);
      startTransition(() => {
        dispatch(formData);
      });
    }
  }, [show, userId, token, dispatch]);

  const handleInputChange = (e) => {
    const formattedValue = e.target.value.replace(",", ".");
    setDepositAmount(formattedValue);
  };

  const handleDeposit = async () => {
    const result = await handleDepositAction(userId, token, currencyCode, depositAmount);
    if (result.error) {
      swalToast(result.error);
    } else {
      swalToast(`You have successfully added ${depositAmount} ${currencyCode} to your ${currencyCode} account.`);
      onDepositSuccess?.();
      onClose();
    }
  };

  const formatCardLabel = (card) => {
    const parts = card.card_number?.replace(/\s|-/g, "").match(/.{1,4}/g) || [];
    return `**** **** **** ${parts[3] || "****"} (Exp: ${card.expiration_date})`;
  };

  const fetchedCards = state?.data || [];
  const hasNoCards = fetchedCards.length === 0;

  return (
    <Modal show={show} onHide={onClose} centered className="deposit-modal">
      <Modal.Header closeButton>
        <Modal.Title>Deposit Money</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted text-center mb-4">
          You are depositing into your <strong>{currencyCode}</strong> account.
        </p>

        {hasNoCards ? (
          <Alert variant="warning" className="text-center">
            You don’t have any saved cards. Please add a credit card to deposit money.
          </Alert>
        ) : (
          <>
            <Form.Group className="mb-3" controlId="cardSelect">
              <Form.Label>Select Credit Card</Form.Label>
              <Form.Select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
              >
                <option value="">-- Choose a card --</option>
                {fetchedCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {formatCardLabel(card)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="depositAmount">
              <Form.Label>Deposit Amount ({currencyCode})</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                placeholder={`Enter deposit amount in ${currencyCode}`}
                value={depositAmount}
                onChange={handleInputChange}
                disabled={!selectedCardId}
              />
            </Form.Group>

            <Button
              className="deposit-button w-100"
              onClick={handleDeposit}
              disabled={!selectedCardId || !depositAmount}
            >
              Deposit
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DepositModal;