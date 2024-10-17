import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useToken() {
  const getToken = () => {
    try {
      const tokenString = localStorage.getItem("id_token");
      const userToken = JSON.parse(tokenString);
      return userToken?.token;
    } catch (error) {
      // Check if the error is a SyntaxError and contains the expected message
    if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
      console.warn("Invalid token detected. Clearing localStorage entry.");

      // Remove the invalid token from localStorage
      localStorage.removeItem("id_token");

      // Optionally: Redirect to login or notify the user
      return null;
    }
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("id_token", JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
