"use server";
import { fetchCurrencyRates, exchange } from "@/services/exchange-service";

export const handleExchangeRequest = async (userId, token, from_currency, to_currency, amount) => {
  const payload = {
    from_currency,
    to_currency,
    amount,
  };

  try {
    const response = await exchange(userId, token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(responseBody);
        return { error: parsed?.error || `Exchange failed with status ${response.status}` };
      } catch {
        return { error: `Exchange failed with status ${response.status}: ${responseBody}` };
      }
    }

    return { data: JSON.parse(responseBody) };
  } catch (error) {
    return { error: error.message };
  }
};


export const handleCurrencyRateFetch = async (currencyCode) => {
  try {
    const response = await fetchCurrencyRates(currencyCode.toLowerCase());

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fetch failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Currency rate fetch error:", error.message);
    return null;
  }
};


