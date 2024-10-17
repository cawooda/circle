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
      if (
        error instanceof SyntaxError &&
        error.message.includes("Unexpected token")
      ) {
        console.warn("Invalid token detected. Clearing localStorage entry.");

        // Remove the invalid token from localStorage
        localStorage.removeItem("id_token");

        // Optionally: Redirect to login or notify the user
        return null;
      }

      // Log other unexpected errors for debugging purposes
      console.error(
        "An unexpected error occurred while retrieving the token.",
        error
      );

      // Optionally, rethrow or return null depending on your needs
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
