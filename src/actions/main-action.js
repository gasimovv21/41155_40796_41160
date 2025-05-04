"use server";
import { fetchCurrencyRates, fetchLast10CurrencyRates } from "@/services/main-service";

export const handleGetExchangeTickerData = async (currencyCode) => {
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

export const handleGetChartData = async (currencyCode) => {
  try {
    const response = await fetchLast10CurrencyRates(currencyCode.toLowerCase());

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