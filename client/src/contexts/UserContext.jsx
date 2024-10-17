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
    skip: !token,
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("Error encountered:", err);
      setHasError(true);
    },
  });

  useEffect(() => {
    if (userData?.getMe.roleProvider) {
      setProvider(userData?.getMe.roleProvider);
    }
    if (
      userData?.getMe &&
      JSON.stringify(user) !== JSON.stringify(userData.getMe)
    ) {
      setUser(userData.getMe);
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
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
