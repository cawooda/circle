import React, { createContext, useState, useEffect, useContext } from "react";

import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Splash from "../components/Splash";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
    onError: () => setHasError(true),
  });

  useEffect(() => {
    if (data && data.getMe) {
      setUser(data.getMe);
      setHasError(false); // Reset error state on successful data fetch
    }
  }, [data]);

  if (loading) return <Splash />;

  return (
    <UserContext.Provider value={{ user, setUser, refetch, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
