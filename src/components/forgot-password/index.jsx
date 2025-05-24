"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./style.scss";
import { handleEmailSend } from "@/actions/forgot-password-action";
import { swalToast } from "@/helpers/swal";

export const ForgotPasswordForm = () => {
  const [emailAdress, setEmailAdress] = useState("");

  const handleSendResetLink = async (e) => {
    e.preventDefault(); // prevent page reload
    await handleEmailSend(emailAdress);
    swalToast("If there is an account related with this account. You will get an email.");
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-card">
        <div className="text">
          <h1>Forgot Password</h1>
          <p>Enter your email and we&apos;ll send you a new password.</p>
        </div>

        <form noValidate onSubmit={handleSendResetLink}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="form-control rounded-3"
              name="email"
              id="email"
              value={emailAdress}
              onChange={(e) => setEmailAdress(e.target.value)}
              autoComplete="new-email"
              required
            />
            <div className="invalid-feedback">Invalid email address</div>
          </div>

          <button type="submit">Send Reset Link</button>
        </form>

        <div className="back-to-signin">
          <Link href="/sign-in">
            <span>&lt;</span> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};