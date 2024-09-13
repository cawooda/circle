import React, { createContext, useState, useEffect, useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_BY_ID } from "../utils/queries";
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

  const profile = AuthService.getProfile();

  const userId = profile?.authenticatedPerson?._id;
  console.log("userId", userId);
  const { loading, error, data, refetch } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: "network-only",
    onError: () => setHasError(true),
  });

  useEffect(() => {
    if (data && data.getMe) {
      setUser(data.getMe);
      setHasError(false); // Reset error state on successful data fetch
    }
  }, [data]);

  const handleRetry = () => {
    refetch(); // Retry the query
  };

  if (loading) return <Splash />;

  return (
    <UserContext.Provider value={{ user, setUser, refetch, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
