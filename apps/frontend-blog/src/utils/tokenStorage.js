import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1]; // Extract the payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)); // Decode the payload

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp > currentTime; // Check if token is expired
  } catch (error) {
    console.log("Token error: " + error);
    return false; // If any error occurs, treat the token as invalid
  }
};

export const decodeToken = () => {
  const decodedToken = jwtDecode(getToken());

  return { id: decodedToken.id, username: decodedToken.username };
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};
