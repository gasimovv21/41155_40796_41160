"use client";
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "./style.scss"; // Stil dosyan

const EditProfileModal = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      className="edit-profile-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-4">Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-end text-muted small mb-4">
          Account Created On: 01/01/2024
        </p>

        <Form>
          <Form.Group className="mb-4">
            <Form.Control className="form-input" placeholder="First Name" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control className="form-input" placeholder="Last Name" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              className="form-input"
              type="email"
              placeholder="Email"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              className="form-input"
              type="tel"
              placeholder="Phone Number"
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Control
              className="form-input"
              type="password"
              placeholder="Password (optional)"
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn-primary-custom w-100 fw-semibold"
            size="lg"
          >
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
