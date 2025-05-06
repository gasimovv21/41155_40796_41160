export const parseJwt = (token) => {
  return JSON.parse(atob(token.split(".")[1]));
};

export const getIsTokenValid = (token) => {
  if (!token) return false;
  const jwtExpireTimeStamp = parseJwt(token).exp;
  const jwtExpireDateTime = new Date(jwtExpireTimeStamp * 1000);

  return jwtExpireDateTime > new Date();
};
