const REQ_BANK_API_URL = process.env.NEXT_PUBLIC_BANK_API_BASE_URL;

export const fetchCurrencyRates = (currency) => {
    return fetch(`${REQ_BANK_API_URL}/exchangerates/rates/c/${currency}/?format=json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const fetchLast10CurrencyRates = (currency) => {
    return fetch(`${REQ_BANK_API_URL}/exchangerates/rates/c/${currency}/last/10/?format=json`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    });
};

