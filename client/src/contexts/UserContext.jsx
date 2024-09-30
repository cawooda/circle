import React, { createContext, useState, useEffect, useContext } from "react";

import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Splash from "../components/Splash";
import SigninForm from "../components/SigninForm";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const {
    loading,
    error,
    data,
    refetch: refetchUser,
  } = useQuery(GET_ME, {
    onError: () => setHasError(true),
  });

  useEffect(() => {
    if (data) {
      setUser(data.getMe);
      setHasError(false); // Reset error state on successful data fetch
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
