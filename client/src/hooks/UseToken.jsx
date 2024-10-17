import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("id_token");
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
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
