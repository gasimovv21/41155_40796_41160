const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const register = (payload) => {
  console.log("payload", payload);
  console.log("REQ_API_URL (fetch):", `${REQ_API_URL}`);
  return fetch(`${REQ_API_URL}/register/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
