const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const withdraw = (userId, token, payload) => {
  return fetch(`${REQ_API_URL}/currency-accounts/withdraw/${userId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};