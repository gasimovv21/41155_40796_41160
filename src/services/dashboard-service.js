const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchAccountsData = (userId, token) => {
  return fetch(`${REQ_API_URL}/currency-accounts/user/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteSelectedAccount = (token, account_id) => {
  return fetch(`${REQ_API_URL}/currency-accounts/${account_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const logOutAPI = (token, payload) => {
  return fetch(`${REQ_API_URL}/logout/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
