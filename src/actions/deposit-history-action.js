"use server";
import { fetchDepositHistoryData } from "@/services/deposit-history-service";

export const getDepositHistoryData = async (prevState, formData) => {
  try {
    const { currencyCode, userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchDepositHistoryData(currencyCode, userId, token);
    const data = await response.json();
    //console.log("Fetched dashboard data:", data);

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