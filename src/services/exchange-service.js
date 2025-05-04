const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const exchange = (userId, token, payload) => {
  console.log(payload);
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
    return fetch(`https://api.nbp.pl/api/exchangerates/rates/c/${currency}/?format=json`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
};