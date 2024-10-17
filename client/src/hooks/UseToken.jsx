import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    try {
      const tokenString = localStorage.getItem("id_token");
      if (!tokenString) return null;
      const userToken = JSON.parse(tokenString);
      return userToken?.token || null;
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    try {
      localStorage.setItem("id_token", JSON.stringify({ token: userToken }));
      setToken(userToken);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}
