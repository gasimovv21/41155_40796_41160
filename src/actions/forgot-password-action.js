"use server";
import { forgotPasswordEmailSend } from "@/services/forgot-password-service";

export const handleEmailSend = async (emailAddress) => {
  const payload = {
    email: emailAddress,
  };

  try {
    const response = await forgotPasswordEmailSend(payload);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Email send failed with status ${response.status}: ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Email send failed error:", error.message);
    return null;
  }
};