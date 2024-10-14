import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";

import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";
import { GET_MY_PROVIDER } from "../utils/queries"; // Adjust the path as necessary

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const token = useMemo(() => AuthService.getToken(), []);
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => AuthService.loggedIn());

  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: refetchUser,
  } = useQuery(GET_ME, {
    variables: { token },
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Error encountered:", err);
      setHasError(true);
    },
  });

  const {
    loading: providerLoading,
    error: providerError,
    data: providerData,
    refetch: refetchProvider,
  } = useQuery(GET_MY_PROVIDER, {
    skip: !user?.roleProvider, // Avoid unnecessary query when no provider is logged in
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Error in getMyProvider:", err);
      setHasError(true);
    },
  });

  useEffect(() => {
    if (
      userData?.getMe &&
      JSON.stringify(user) !== JSON.stringify(userData.getMe)
    ) {
      setUser(userData.getMe);
      setHasError(false);
    }
  }, [userData, user]);

  useEffect(() => {
    if (
      providerData?.getMyProvider &&
      JSON.stringify(provider) !== JSON.stringify(providerData.getMyProvider)
    ) {
      setProvider(providerData.getMyProvider);
      setHasError(false);
    }
  }, [providerData, provider]);

  return (
    <UserContext.Provider
      value={{
        user,
        provider,
        refetchUser,
        refetchProvider,
        userLoading,
        userError,
        providerLoading,
        providerError,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
