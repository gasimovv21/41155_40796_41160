"use server";
import { fetchWithdrawHistoryData } from "@/services/withdraw-history-service";

export const getWithdrawHistoryData = async (prevState, formData) => {
  try {
    const { currencyCode, userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchWithdrawHistoryData(currencyCode, userId, token);
    const data = await response.json();
    console.log(data)

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