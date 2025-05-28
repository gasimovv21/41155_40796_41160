"use client";
import React, { useEffect, useState, startTransition } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import "./style.scss";
import {
  getCreditCardsData,
  handleDeleteSelectedCard,
} from "@/actions/my-cards-action";
import Image from "next/image";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";
import AddCardModal from "../add-cards";
import { swalConfirm, swalToast } from "@/helpers/swal";

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

  const getCardTypeIcon = (cardNumber) => {
    if (!cardNumber) return "/icons/cards/other.svg";

    const cleanNumber = cardNumber.replace(/\s|-/g, "");

    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanNumber)) {
      return "/icons/cards/visa.svg";
    } else if (/^5[1-5][0-9]{14}$/.test(cleanNumber) || /^2[2-7][0-9]{14}$/.test(cleanNumber)) {
      return "/icons/cards/master.svg";
    } else if (/^(5018|5020|5038|5893|6304|6759|6761|6763)/.test(cleanNumber)) {
      return "/icons/cards/maestro.svg";
    }

    return "/icons/cards/other.svg";
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
    const cardIcon = getCardTypeIcon(card.card_number);

    const handleDelete = async (card_id, last_4_digit) => {
      const resp = await swalConfirm(`Are you sure to remove card XXXX-XXXX-XXXX-${last_4_digit}?`);
      if (!resp.isConfirmed) return;

      const result = await handleDeleteSelectedCard(token, card_id);
      if (result) {
        setReloadKey((prev) => prev + 1);
        setTimeout(() => {
          swalToast(
            `The card with the last 4 digits ${last_4_digit} has been removed successfully.`
          );
        }, 800);
      }
    };

    return (
      <Card key={index} className="credit-card mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">Your Verified Card</div>
              <div className="text-muted d-flex align-items-center gap-2">
              <Image src={cardIcon} alt="Card type" width={32} height={20} />
              <span className="card-number-display">{cardDisplay}</span>
              <Image
                src={
                  isVisible
                    ? "/icons/eye/State=Default.svg"
                    : "/icons/eye/State=Dissabled.svg"
                }
                alt="Toggle visibility"
                width={20}
                height={20}
                style={{ cursor: "pointer" }}
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