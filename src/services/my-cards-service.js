const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchCreditCardsData = (userId, token) => {
  return fetch(`${REQ_API_URL}/credit-card/user/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addCreditCard = (token, payload) => {
  console.log(payload)
  return fetch(`${REQ_API_URL}/credit-card/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCreditCard = (token, selectedCardId) => {
  return fetch(`${REQ_API_URL}/credit-card/${selectedCardId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};