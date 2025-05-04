"use server";
import { fetchAccountsData, addAccount, deleteSelectedAccount } from "@/services/dashboard-service";

export const getDashboardData = async (prevState, formData) => {
  try {
    const { userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchAccountsData(userId, token);
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

export const handleAddAccount = async ( token, currency_code, userId ) => {
  const payload = {
    currency_code: currency_code,
    userId: userId,
  };

  try {
      const response = await addAccount(token, payload);
      const responseBody = await response.text();
  
      if (!response.ok) {
        throw new Error(`Failed adding account ${response.status}: ${responseBody}`);
      }
      
      return JSON.parse(responseBody);
  } catch (error) {
      console.error("Adding account error:", error.message);
      return null;
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