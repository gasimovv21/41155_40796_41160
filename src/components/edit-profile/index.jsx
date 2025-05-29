"use client";
import React, { useEffect, useRef, startTransition } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { handleLogOutAPI } from "@/actions/dashboard-action";
import "./style.scss";
import { useActionState } from "react";
import {
  getUserData,
  handleSendingSavedUserData,
} from "@/actions/edit-profile-action";
import { initialResponse } from "@/helpers/formValidation";
import { swalConfirm, swalToast } from "@/helpers/swal";
import { signOut } from "next-auth/react";

const EditProfileModal = ({ show, onHide, userId, token, refreshToken }) => {
  const [state, dispatch] = useActionState(getUserData, initialResponse);
  const formRef = useRef(null);

  useEffect(() => {
    if (show && userId && token) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("token", token);
      startTransition(() => {
        dispatch(formData);
      });
    }
  }, [show, userId, token]);

  const userData = state?.data || {};

  const handleSubmitConfirmation = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const newPassword = form["newPassword"].value;
    const confirmNewPassword = form["confirmNewPassword"].value;

    if (newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        swalToast("Passwords do not match.");
        return;
      }
    }

    const resp = await swalConfirm(
      "If you want to save the changes, you will need to sign in again. Do you want to continue?"
    );

    if (!resp.isConfirmed) return;

    await handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const firstName = form["firstName"].value;
    const lastName = form["lastName"].value;
    const phone = form["phone"].value;
    const newPassword = form["newPassword"].value;
    const secretKey = form["secretKey"].value;

    const result = await handleSendingSavedUserData(
      userId,
      token,
      firstName,
      lastName,
      phone,
      newPassword,
      secretKey
    );

    if (result?.data) {
      const result = await handleLogOutAPI(token, refreshToken);
      if (result.error) {
        swalToast(result.error);
      } else {
        swalToast(`You have successfully logged out. Redirecting to main page..`);
        setTimeout(() => {
          onHide();
          signOut({ callbackUrl: "/" });
        }, 1500);
      }
    } else {
      swalToast("Failed saving. Either input is invalid or secret key is incorrect.");
    }
  };

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
        <div className="d-flex justify-content-end">
          <div className="account-created-on">
            Account Created On: {userData.account_created_on?.slice(0, 10) || "N/A"}
          </div>
        </div>

        <div className="user-info mb-3">
          <div>
            <strong>Username:</strong> {userData.username || "N/A"}
          </div>
          <div>
            <strong>Email:</strong> {userData.email || "N/A"}
          </div>
        </div>

        <Form ref={formRef} onSubmit={handleSubmitConfirmation}>
          <Form.Group className="mb-4">
            <Form.Control
              name="firstName"
              className="form-input"
              placeholder="First Name"
              defaultValue={userData.first_name || ""}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              name="lastName"
              className="form-input"
              placeholder="Last Name"
              defaultValue={userData.last_name || ""}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              name="phone"
              className="form-input"
              type="tel"
              placeholder="Phone Number"
              defaultValue={userData.phone_number || ""}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              name="newPassword"
              className="form-input"
              type="password"
              placeholder="New Password (optional)"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              name="confirmNewPassword"
              className="form-input"
              type="password"
              placeholder="Confirm New Password"
            />
          </Form.Group>
          
          <hr />

          <Form.Group className="mb-4">
            <Form.Control
              name="secretKey"
              className="form-input"
              type="text"
              placeholder="Enter your secret key to confirm changes"
              required
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