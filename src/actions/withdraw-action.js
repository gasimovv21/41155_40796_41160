"use server";
import { withdraw } from "@/services/withdraw-service";

export const handleWithdrawAction = async (userId, token, currencyCode, amount, card_id) => {
  const payload = {
    currency: currencyCode,
    amount: amount,
    card_id: card_id
  };

  try {
    const response = await withdraw(userId, token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(responseBody);
        return { error: parsed?.error || `Withdraw failed with status ${response.status}` };
      } catch {
        return { error: `Withdraw failed with status ${response.status}` };
      }
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Deposit error:", error.message);
    return { error: error.message };
  }
};