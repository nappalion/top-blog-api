import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

export const decodeToken = () => {
  const decodedToken = jwtDecode(getToken());

  return { id: decodedToken.id, username: decodedToken.username };
};
