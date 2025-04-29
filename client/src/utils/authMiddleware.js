export const getToken = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).token
    : null;
};

export const isAdmin = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?.isAdmin === true;
};
