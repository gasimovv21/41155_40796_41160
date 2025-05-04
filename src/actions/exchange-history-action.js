"use server";
import { fetchExchangeHistoryData } from "@/services/exchange-history-service";

export const getExchangeHistoryData = async (prevState, formData) => {
  try {
    const { userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchExchangeHistoryData(userId, token);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: data?.message || "Something went wrong.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};