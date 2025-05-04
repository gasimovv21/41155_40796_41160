const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchAccountsData = (userId, token) => {
  //console.log("REQ_API_URL (fetch):", `${REQ_API_URL}/currency-accounts/user/${userId}/`);
  return fetch(`${REQ_API_URL}/currency-accounts/user/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteSelectedAccount = (token, account_id) => {
  //console.log("REQ_API_URL (fetch):", `${REQ_API_URL}/currency-accounts/user/${account_id}/`);
  return fetch(`${REQ_API_URL}/currency-accounts/${account_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
