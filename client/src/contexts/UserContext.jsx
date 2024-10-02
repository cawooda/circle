import React, { createContext, useState, useEffect, useContext } from "react";

import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => AuthService.loggedIn());

  const {
    loading,
    error,
    data,
    refetch: refetchUser,
  } = useQuery(GET_ME, {
    variables: { token: AuthService.getToken() },
    onError: () => setHasError(true),
    skip: !loggedIn,
  });
  console.log("!loggedIn ", !loggedIn);
  useEffect(() => {
    const tokenCheck = AuthService.loggedIn();
    setLoggedIn(tokenCheck);
  }, []);

  useEffect(() => {
    if (data) {
      if (data.getMe) {
        setUser(data.getMe);

        setHasError(false); // Reset error state on successful data fetch
      }
    }
  }, [data, loading]);

  return (
    <UserContext.Provider
      value={{ user, setUser, refetchUser, loading, error }}
    >
      {children}
    </UserContext.Provider>
  );
};
