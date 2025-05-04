"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";
import "./style.scss";
import SignInButton from "../common/buttons/sign-in";
import Link from "next/link";
import { useActionState } from "react";
import { initialResponse } from "@/helpers/formValidation";
import { loginAction } from "@/actions/auth-action";
import { swalToast } from "@/helpers/swal";

const SignInForm = () => {
  const [state, formAction] = useActionState(loginAction, initialResponse);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get("error");
    if (error) {
      swalToast(error);
    }
  }, []);

  return (
    <div className="sing-in-page">
      <Container className="signin-container">
        <Row className="align-items-center">
          <Col md={12} className="form-column">
            <Card className="signin-card">
              <Card.Body>
                <h1 className="text-center mb-4">Welcome to Currency </h1>
                <p className="text-center text-muted mb-4">
                  Revolutionizing the way we create, render, and experience.
                </p>
                {!state?.success && state?.message && (
                  <Alert variant="danger" className="text-center">
                    {state.message}
                  </Alert>
                )}
                <Form action={formAction} noValidate>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      className={`form-control rounded-3 ${
                        state?.errors?.username ? "is-invalid" : ""
                      }`}
                      name="username"
                      required
                    />
                    <div className="invalid-feedback">
                      {state?.errors?.username}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      className={`form-control rounded-3 ${
                        state?.errors?.password ? "is-invalid" : ""
                      }`}
                      name="password"
                      required
                    />
                    <div className="invalid-feedback">
                      {state?.errors?.password}
                    </div>
                    <div className="forgot-password-link-wrapper">
                      <Link href="/forgot" className="forgot-password-link">
                        Forgot password?
                      </Link>
                    </div>
                  </Form.Group>

                  <SignInButton />
                </Form>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Don’t have an account? <Link href="/sign-up">Sign up</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignInForm;
