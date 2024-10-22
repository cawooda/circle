import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import useToken from "../hooks/UseToken";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const token = useMemo(() => AuthService.getToken(), []);

  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => AuthService.loggedIn());

  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: refetchUser,
  } = useQuery(GET_ME, {
    variables: { token: token },
    skip: !token,
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Error encountered:", err);
      setHasError(true);
    },
  });

  useEffect(() => {
    if (!userLoading && userData?.getMe) {
      setUser({ ...userData.getMe, loggedIn: true });
      if (userData?.getMe.roleProvider) {
        setProvider(userData?.getMe.roleProvider);
      }
      setHasError(false);
    }
  }, [userData, user, provider]);

  return (
    <UserContext.Provider
      value={{
        user,
        provider,
        refetchUser,
        userLoading,
        userError,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
