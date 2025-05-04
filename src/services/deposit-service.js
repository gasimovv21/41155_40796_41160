const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const deposit = (userId, token, payload) => {
  console.log("🛠 Final API URL:", `${REQ_API_URL}/currency-accounts/deposit/${userId}/`);
  console.log("📦 Payload:", payload);

  return fetch(`${REQ_API_URL}/currency-accounts/deposit/${userId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};