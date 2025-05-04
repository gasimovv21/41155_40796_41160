const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REQ_BANK_API_URL = process.env.NEXT_PUBLIC_BANK_API_BASE_URL;

export const exchange = (userId, token, payload) => {
  return fetch(`${REQ_API_URL}/currency-accounts/convert/${userId}/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchCurrencyRates = (currency) => {
    return fetch(`${REQ_BANK_API_URL}/exchangerates/rates/c/${currency}/?format=json`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
};