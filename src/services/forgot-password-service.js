const REQ_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const forgotPasswordEmailSend = (payload) => {
  console.log("payload", payload);
  //console.log("REQ_API_URL (fetch):", `${REQ_API_URL}/forgot-password/`);
  return fetch(`${REQ_API_URL}/forgot-password/`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
