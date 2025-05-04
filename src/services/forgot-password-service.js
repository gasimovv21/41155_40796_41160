const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const forgotPasswordEmailSend = (payload) => {
  return fetch(`${REQ_API_URL}/forgot-password/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
