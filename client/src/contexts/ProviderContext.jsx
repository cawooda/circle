import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";

import { GET_MY_PROVIDER } from "../utils/queries"; // Adjust the path as necessary
import { useUser } from "./UserContext";

const ProviderContext = createContext();

export const useProvider = () => useContext(ProviderContext);

export const ProviderProvider = ({ children }) => {
  const { user, refetchUser } = useUser();

  const [provider, setProvider] = useState({});
  const isProvider = user?.roleProvider || null;
  const {
    loading,
    error,
    data,
    refetch: refetchProvider,
  } = useQuery(GET_MY_PROVIDER, {
    skip: !isProvider, // Skip query if no userId is available
  });
  refetchUser();
  useEffect(() => {
    if (data && data.getMyProvider) {
      setProvider(data.getMyProvider);
    }
  }, [data, loading]);

  return (
    <ProviderContext.Provider
      value={{ provider, loading, error, refetchProvider }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
