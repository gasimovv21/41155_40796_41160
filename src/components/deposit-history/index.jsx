"use client";
import React, { useEffect, startTransition } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import "./style.scss";
import { getDepositHistoryData } from "@/actions/deposit-history-action";
//import { useFormState } from "react-dom";
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
          <ListGroup className="deposit-list">
            {depositHistory.map((item) => (
              <ListGroup.Item key={item.deposit_id} className="deposit-item">
                <strong className="deposit-amount">
                  +{item.amount} {item.currency_code}
                </strong>
                <div className="deposit-date">Date: {item.created_at}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
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