"use client";
import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { signUpPageAction } from "@/actions/signUpAction";
import { initialResponse } from "@/helpers/formValidation";
import "./style.scss";
import Link from "next/link";
import Image from "next/image";
import eyeDefault from "../../../public/icons/eye/State=Default.svg";
import eyeDisabled from "../../../public/icons/eye/State=Dissabled.svg";
import { useRouter } from "next/navigation";
import { swalToast } from "@/helpers/swal";
import SignUpButton from "../common/buttons/sign-up";

const SignUpPageForm = () => {
  const [state, dispatch] = useActionState(signUpPageAction, initialResponse);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      swalToast(state.data.message, "success");
      setTimeout(() => {
        router.push(`/sign-in`);
      }, 1000);
    }
  }, [state, router]);

  return (
    <div className="signup-page-form">
      <div className="text">
        <h1>Sign up</h1>
        <p>Please sign up to create your account</p>
      </div>

      {!state.success && state?.message && (
        <div className="alert alert-danger">{state.message}</div>
      )}

      <form action={dispatch} noValidate>
        <div className="row">
          {/* Username */}
          <div className="col-12">
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                className={`form-control rounded-3 ${
                  state?.errors?.username ? "is-invalid" : ""
                }`}
                name="username"
                id="username"
              />
              <div className="invalid-feedback">{state?.errors?.username}</div>
            </div>
          </div>

          {/* Email */}
          <div className="col-12">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className={`form-control rounded-3 ${
                  state?.errors?.email ? "is-invalid" : ""
                }`}
                name="email"
                id="email"
              />
              <div className="invalid-feedback">{state?.errors?.email}</div>
            </div>
          </div>

          {/* First Name */}
          <div className="col-12 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                placeholder="First Name"
                className={`form-control rounded-3 ${
                  state?.errors?.first_name ? "is-invalid" : ""
                }`}
                name="first_name"
                id="first_name"
              />
              <div className="invalid-feedback">
                {state?.errors?.first_name}
              </div>
            </div>
          </div>

          {/* Last Name */}
          <div className="col-12 col-sm-6">
            <div className="input-group">
              <input
                type="text"
                placeholder="Last Name"
                className={`form-control rounded-3 ${
                  state?.errors?.last_name ? "is-invalid" : ""
                }`}
                name="last_name"
                id="last_name"
              />
              <div className="invalid-feedback">{state?.errors?.last_name}</div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="col-12">
            <div className="input-group">
              <input
                type="text"
                placeholder="Phone Number"
                className={`form-control rounded-3 ${
                  state?.errors?.phone_number ? "is-invalid" : ""
                }`}
                name="phone_number"
                id="phone_number"
              />
              <div className="invalid-feedback">
                {state?.errors?.phone_number}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="col-12 col-sm-6">
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`form-control rounded-3 ${
                  state?.errors?.password ? "is-invalid" : ""
                }`}
                name="password"
                id="password"
              />
              <div className="invalid-feedback">{state?.errors?.password}</div>
              <Image
                src={showPassword ? eyeDefault : eyeDisabled}
                className="passwordEye"
                width={25}
                height={17}
                alt="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="col-12 col-sm-6">
            <div className="input-group password-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`form-control rounded-3 ${
                  state?.errors?.confirmPassword ? "is-invalid" : ""
                }`}
                name="confirmPassword"
                id="confirmPassword"
              />
              <div className="invalid-feedback">
                {state?.errors?.confirmPassword}
              </div>
              <Image
                src={showConfirmPassword ? eyeDefault : eyeDisabled}
                className="passwordEye"
                width={25}
                height={17}
                alt="toggle-confirm-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="col-12">
            <div className="form-check">
              <input
                className={`form-check-input ${
                  state?.errors?.privacyPolicy ? "is-invalid" : ""
                }`}
                type="checkbox"
                id="privacyPolicy"
                name="privacyPolicy"
              />
              <label className="form-check-label" htmlFor="privacyPolicy">
                I understand and agree to Currency Web
              </label>
              <div className="invalid-feedback">
                {state?.errors?.privacyPolicy}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <SignUpButton />
        </div>
      </form>

      <div className="text-center mt-3">
        <small>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </small>
      </div>
    </div>
  );
};

export default SignUpPageForm;
