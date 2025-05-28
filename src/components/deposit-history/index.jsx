"use client";
import React, { useEffect, startTransition } from "react";
import { Modal, Button } from "react-bootstrap";
import "./style.scss";
import { getDepositHistoryData } from "@/actions/deposit-history-action";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";

const DepositHistoryModal = ({ show, onClose, currencyCode, userId, token }) => {
  const [state, dispatch] = useActionState(getDepositHistoryData, initialResponse);

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

  const depositHistory = state?.data || [];

  return (
    <Modal show={show} onHide={onClose} size="lg" centered className="deposit-modal">
      <Modal.Header closeButton>
        <Modal.Title className="deposit-title">Deposit History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {depositHistory.length === 0 ? (
          <p className="no-history-text text-center">No deposit history available.</p>
        ) : (
          <div className="deposit-list">
            {depositHistory.map((item) => (
              <div key={item.deposit_id} className="deposit-item">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success">Verified Deposit</span>
                  <span className="text-success fw-semibold fs-5">
                    +{item.amount} {item.currency_code}
                  </span>
                </div>
                <div className="deposit-date text-muted small">
                  Date: {item.created_at}
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

export default DepositHistoryModal;
