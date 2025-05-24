"use server";
import { fetchCreditCardsData, addCreditCard, deleteCreditCard} from "@/services/my-cards-service";

export const getCreditCardsData = async (prevState, formData) => {
  try {
    const { userId, token } = Object.fromEntries(formData.entries());
    const response = await fetchCreditCardsData(userId, token);
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


export const handleAddNewCreditCard = async (token, userId, cardNumber, expiration, cvv) => {
  const payload = {
    user: userId,
    card_number: cardNumber,
    expiration_date: expiration,
    cvv: cvv
  };

  try {
    const response = await addCreditCard(token, payload);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to add a new credit card: ${response.status} - ${responseBody}`);
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Add a new credit card error:", error.message);
    return null;
  }
};


export const handleDeleteSelectedCard = async (token, selectedCard) => {
  try {
    const response = await deleteCreditCard(token, selectedCard);
    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Failed deleting selected card ${response.status}: ${responseBody}`);
    }

    // ✅ Only parse if there's actual content
    return responseBody ? JSON.parse(responseBody) : {};
  } catch (error) {
    console.error("Deletion error:", error.message);
    return null;
  }
};
