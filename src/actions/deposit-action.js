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
      try {
        const parsed = JSON.parse(responseBody);
        const firstError = Object.values(parsed)?.[0]?.[0];
        return {
          error:
            firstError ||
            parsed?.error ||
            `Deposit failed with status ${response.status}`,
        };
      } catch {
        return { error: `Deposit failed with status ${response.status}` };
      }
    }

    return JSON.parse(responseBody);
  } catch (error) {
    return { error: error.message };
  }
};
