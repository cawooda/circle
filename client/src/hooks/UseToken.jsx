import { useState } from "react";

import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Check if expired
  } catch (error) {
    console.error("Error decoding the token:", error);
    return true; // Assume expired if decoding fails
  }
};

export default function useToken() {
  const getToken = () => {
    try {
      const tokenString = localStorage.getItem("id_token");
      const userToken = JSON.parse(tokenString);
      console.log(userToken);
      const { authenticatedPerson } = jwtDecode(userToken.token);
      console.log(authenticatedPerson.mobile);
      if (!isTokenExpired(userToken?.token)) {
        localStorage.setItem("user_mobile", authenticatedPerson.mobile);
        return userToken.token;
      } else {
        localStorage.removeItem("id_token"); // Clear invalid/expired token
        localStorage.setItem("user_mobile", authenticatedPerson.mobile);
        return null;
      }
    } catch (error) {
      if (
        error instanceof SyntaxError &&
        error.message.includes("Unexpected token")
      ) {
        console.warn("Invalid token detected. Clearing localStorage entry.");
        localStorage.removeItem("id_token");
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
