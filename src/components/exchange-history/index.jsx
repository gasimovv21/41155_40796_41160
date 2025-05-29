"use client";
import React, { useEffect, startTransition } from "react";
import { Modal, Button } from "react-bootstrap";
import "./style.scss";
import { getExchangeHistoryData } from "@/actions/exchange-history-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";

const ExchangeHistoryModal = ({ show, onClose, userId, token }) => {
  const [state, dispatch] = useActionState(getExchangeHistoryData, initialResponse);

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

  const exchangeHistory = state?.data || [];

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      className="exchange-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="exchange-title">Exchange History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {exchangeHistory.length === 0 ? (
          <p className="no-history-text text-center">
            No exchange history available.
          </p>
        ) : (
          <div className="exchange-list">
            {exchangeHistory.map((item) => {
              const isIncome = item.action === "income";
              const amountPrefix = isIncome ? "+" : "-";
              const colorClass = isIncome ? "text-success" : "text-danger";
  
              return (
                <div key={item.history_id} className="history-card border rounded p-3 mb-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`badge ${isIncome ? "bg-success" : "bg-danger"}`}>
                      {isIncome ? "Income" : "Expense"}
                    </span>
                    <span className={`fs-5 fw-semibold ${colorClass}`}>
                      {amountPrefix}{item.amount} {item.currency}
                    </span>
                  </div>
                  <div className="text-muted small">
                    Date: {item.created_at.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="exchange-close-btn" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExchangeHistoryModal;