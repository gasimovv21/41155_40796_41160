"use client";
import React, { useEffect, useState, startTransition } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./style.scss";
import { swalToast } from "@/helpers/swal";
import { handleWithdrawAction } from "@/actions/withdraw-action";
import { getCreditCardsData } from "@/actions/my-cards-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";

const WithdrawModal = ({ show, onClose, currencyCode, userId, token, onWithdrawSuccess }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
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
    setWithdrawAmount(formattedValue);
  };

  const handleWithdraw = async () => {
    const result = await handleWithdrawAction(userId, token, currencyCode, withdrawAmount, selectedCardId);
    if (result.error) {
          swalToast(result.error);
    } else {
      swalToast(`You have successfully withdrawn ${withdrawAmount} ${currencyCode}.`);
      onWithdrawSuccess?.();
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
    <Modal show={show} onHide={onClose} centered className="withdraw-modal">
      <Modal.Header closeButton>
        <Modal.Title>Withdraw Money</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted text-center mb-4">
          You are withdrawing from your <strong>{currencyCode}</strong> account.
        </p>

        {hasNoCards ? (
          <Alert variant="warning" className="text-center">
            You don’t have any saved cards. Please add a credit card to withdraw money.
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

            <Form.Group className="mb-3" controlId="withdrawAmount">
              <Form.Label>Withdraw Amount ({currencyCode})</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                placeholder={`Enter withdraw amount in ${currencyCode}`}
                value={withdrawAmount}
                onChange={handleInputChange}
                disabled={!selectedCardId}
              />
            </Form.Group>

            <Button
              className="withdraw-button w-100"
              onClick={handleWithdraw}
              disabled={!selectedCardId || !withdrawAmount}
            >
              Withdraw
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default WithdrawModal;