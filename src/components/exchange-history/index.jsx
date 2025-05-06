import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import "./style.scss";

const ExchangeHistoryModal = ({ show, onHide }) => {
  const exchangeHistory = [
    {
      id: 1,
      amount: "150.00",
      created_at: "2025-04-15T12:00:00Z",
    },
    {
      id: 2,
      amount: "250.00",
      created_at: "2025-04-14T09:30:00Z",
    },
  ];

  const currencyCode = "USD";

  return (
    <Modal
      show={show}
      onHide={onHide}
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
          <ListGroup className="exchange-list">
            {exchangeHistory.map((item) => (
              <ListGroup.Item key={item.id} className="exchange-item">
                <strong className="exchange-amount">
                  +{item.amount} {currencyCode}
                </strong>
                <div className="exchange-date">Date: {item.created_at}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="exchange-close-btn" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExchangeHistoryModal;
