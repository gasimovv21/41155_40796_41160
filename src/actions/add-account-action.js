"use server";
import { addAccount } from "@/services/add-account-service";

export const handleAddAccount = async (token, currency_code, userId) => {
  const payload = {
    currency_code: currency_code,
    user: userId,
  };

  try {
    const response = await addAccount(token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to add account: ${response.status} - ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Add account error:", error.message);
    return null;
  }
};
