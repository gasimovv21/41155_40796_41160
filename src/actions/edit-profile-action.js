"use server";
import { fetchUserData, sendSavedUserData } from "@/services/edit-profile-service";

export const getUserData = async (prevState, formData) => {
  try {
    const { currencyCode, userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchUserData(userId, token);
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

export const handleSendingSavedUserData = async (userId, token, firstName, lastName, phone, password) => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      ...(password ? { password } : {}),
    };
  
    try {
      const response = await sendSavedUserData(userId, token, payload);
      const responseBody = await response.text();
  
      if (!response.ok) {
        try {
          const parsed = JSON.parse(responseBody);
          return { error: parsed?.message || `Update failed with status ${response.status}` };
        } catch {
          return { error: `Update failed with status ${response.status}: ${responseBody}` };
        }
      }
  
      return { data: JSON.parse(responseBody) };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  
  