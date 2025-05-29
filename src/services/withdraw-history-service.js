const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchWithdrawHistoryData = (currencyCode, userId, token ) => {
  return fetch(`${REQ_API_URL}/credit-card/withdraw-history/${userId}/?currency_code=${currencyCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
