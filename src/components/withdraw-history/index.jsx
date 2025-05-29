"use client";
import React, { useEffect, startTransition } from "react";
import { Modal, Button } from "react-bootstrap";
import "./style.scss";
import { getWithdrawHistoryData } from "@/actions/withdraw-history-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";

const WithdrawHistoryModal = ({ show, onClose, currencyCode, userId, token }) => {
  const [state, dispatch] = useActionState(getWithdrawHistoryData, initialResponse);

useEffect(() => {
  if (show && currencyCode && userId && token) {
    const formData = new FormData();
    formData.append("currencyCode", currencyCode);
    formData.append("userId", userId);
    formData.append("token", token);
    startTransition(() => {
      dispatch(formData);
    });
  }
}, [show, currencyCode, userId, token, dispatch]);

useEffect(() => {
  console.log("Withdraw History Data:", state?.data);
}, [state]);


  const withdrawHistory = state?.data || [];

  return (
    <Modal show={show} onHide={onClose} size="lg" centered className="withdraw-modal">
      <Modal.Header closeButton>
        <Modal.Title className="withdraw-title">Withdraw History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {withdrawHistory.length === 0 ? (
          <p className="no-history-text text-center">No withdraw history available.</p>
        ) : (
          <div className="withdraw-list">
            {withdrawHistory.map((item) => (
              <div key={item.id} className="withdraw-item">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success">Verified Withdraw</span>
                  <span className="text-danger fw-semibold fs-5">
                    -{item.amount} {item.currency}
                  </span>
                </div>
                <div className="withdraw-date text-muted small">
                  Date: {item.created_at}
                </div>
                <div className="withdraw-card-number text-muted small mt-2">
                  Card: {item.card_number}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="close-btn" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WithdrawHistoryModal;