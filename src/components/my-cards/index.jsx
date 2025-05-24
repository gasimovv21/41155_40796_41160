"use client";
import React, { useEffect, useState, startTransition } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import "./style.scss";
import {
  getCreditCardsData,
  handleDeleteSelectedCard,
} from "@/actions/my-cards-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";
import AddCardModal from "./addCard";
import { swalToast } from "@/helpers/swal";

const MyCardsModal = ({ show, onClose, userId, token }) => {
  const [state, dispatch] = useActionState(getCreditCardsData, initialResponse);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    if (show && userId && token) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("token", token);
      startTransition(() => {
        dispatch(formData);
      });
    }
  }, [show, userId, token, dispatch, reloadKey]);

  const toggleCardVisibility = (cardId) => {
    setVisibleCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const formatCardNumber = (number, visible) => {
    if (!number) return "";

    const clean = number.replace(/\s|-/g, "");
    const parts = clean.match(/.{1,4}/g) || [];

    return visible
      ? parts.join("-")
      : `XXXX-XXXX-XXXX-${parts[3] || "****"}`;
  };

  const fetchedCards = state?.data || [];
  const cards = [fetchedCards[0] || null, fetchedCards[1] || null];

  const renderCardSlot = (card, index) => {
    if (!card) {
      return (
        <Card
          key={`empty-${index}`}
          className="credit-card empty-slot mb-3 text-center"
        >
          <Card.Body>
            <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
              + Add Credit Card
            </Button>
          </Card.Body>
        </Card>
      );
    }

    const isVisible = visibleCards[card.id];
    const cardDisplay = formatCardNumber(card.card_number, isVisible);

    const handleDelete = async (card_id, last_4_digit) => {
      const result = await handleDeleteSelectedCard(token, card_id);
      if (result) {
        setReloadKey((prev) => prev + 1);
        setTimeout(() => {
          swalToast(
            `Card ending in ${last_4_digit} has been deleted successfully.`
          );
        }, 800);
      }
    };

    return (
      <Card key={index} className="credit-card mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">Cardholder</div>
            <div className="text-muted d-flex align-items-center gap-2">
              {cardDisplay}
              <img
                src={
                  isVisible
                    ? "/icons/eye/State=Default.svg"
                    : "/icons/eye/State=Dissabled.svg"
                }
                alt="Toggle visibility"
                style={{ cursor: "pointer", width: "20px", height: "20px" }}
                onClick={() => toggleCardVisibility(card.id)}
              />
            </div>
            <div className="text-muted">Exp: {card.expiration_date}</div>
            <div className="text-muted small mt-1">
              Added on: {card.created_at}
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              handleDelete(card.id, card.card_number?.slice(-4))
            }
          >
            Remove card
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        size="md"
        className={`cards-modal ${showAddModal ? "blurred" : ""}`}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Credit Cards</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="cards-wrapper">
            {cards.map((card, i) => renderCardSlot(card, i))}
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <AddCardModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        userId={userId}
        token={token}
        onAddSuccess={() => setReloadKey((prev) => prev + 1)}
      />
    </>
  );
};

export default MyCardsModal;