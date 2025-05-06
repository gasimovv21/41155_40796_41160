"use server";
import { deposit } from "@/services/deposit-service";

export const handleDepositAction = async (userId, token, currencyCode, amount) => {
  const payload = {
    user_currency_account_code: currencyCode,
    amount: parseFloat(amount),
  };

  try {
    const response = await deposit(userId, token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Deposit failed with status ${response.status}: ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Deposit error:", error.message);
    return null;
  }
};
