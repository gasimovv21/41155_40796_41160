const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const login = (payload) => {
  return fetch(`${REQ_API_URL}/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};