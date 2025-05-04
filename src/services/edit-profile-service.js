const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchUserData = (userId, token) => {
  return fetch(`${REQ_API_URL}/users/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendSavedUserData = (userId, token, payload) => {
    return fetch(`${REQ_API_URL}/users/${userId}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
