const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchExchangeHistoryData = ( userId, token ) => {
  return fetch(`${REQ_API_URL}/currency-accounts/history/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
