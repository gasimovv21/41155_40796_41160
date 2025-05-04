"use server";
import { fetchAccountsData, deleteSelectedAccount, logOutAPI } from "@/services/dashboard-service";

export const getDashboardData = async (prevState, formData) => {
  try {
    const { userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchAccountsData(userId, token);
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

export const handleDeleteSelectedAccount = async ( token, account_id ) => {
  try {
      const response = await deleteSelectedAccount(token, account_id);
      const responseBody = await response.text();
  
      if (!response.ok) {
        throw new Error(`Failed deleting selected account ${response.status}: ${responseBody}`);
      }

      return JSON.parse(responseBody);
  } catch (error) {
      console.error("Deletion error:", error.message);
      return null;
    }
};

export const handleLogOutAPI = async (token, refresh) => {
  const payload = {
    refresh
  };

  try {
    const response = await logOutAPI(token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      try {
        const parsed = JSON.parse(responseBody);
        return { error: parsed?.error || `Logging out failed with status ${response.status}` };
      } catch {
        return { error: `Logging out failed with status ${response.status}: ${responseBody}` };
      }
    }

    return { data: JSON.parse(responseBody) };
  } catch (error) {
    return { error: error.message };
  }
};