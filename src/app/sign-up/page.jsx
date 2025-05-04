"use client";
import React from "react";
import SignUpPageForm from "@/components/sign-up";
import "./style.scss"; // <- stil dosyasını unutma

const SignUpPage = () => {
  return (
    <div className="signup-page-wrapper">
      <SignUpPageForm />
    </div>
  );
};

export default SignUpPage;
