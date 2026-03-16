import { useState } from "react";

import { jwtDecode } from "jwt-decode";
import AuthService from "../utils/auth";

const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(AuthService.getToken());
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Check if expired
  } catch (error) {
    console.error("Error decoding the token:", error);
    return true; // Assume expired if decoding fails
  }
};

export default function useToken() {
  const getToken = () => AuthService.getToken();

  const [token, setToken] = useState(getToken() || null);

  const saveToken = (userToken) => {
    localStorage.setItem("id_token", userToken);
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
