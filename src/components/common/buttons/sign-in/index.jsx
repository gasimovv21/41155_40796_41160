import React from "react";
import { useFormStatus } from "react-dom";
import "./style.scss";

const SignInButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="signin-btn" type="submit">
      {pending ? (
        <div
          className="spinner-border spinner-border-sm text-secondary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>Sign in</>
      )}
    </button>
  );
};

export default SignInButton;
