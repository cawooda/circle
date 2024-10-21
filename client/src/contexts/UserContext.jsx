import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import { useQuery } from "@apollo/client";
import useToken from "../hooks/UseToken"; // Assuming this handles the token logic
import { GET_ME } from "../utils/queries";
import AuthService from "../utils/auth";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Memoize the token to ensure it doesn't trigger re-renders.
  const token = useMemo(() => AuthService.getToken(), []);

  // Consolidated state for user and provider.
  const [userState, setUserState] = useState({
    user: null,
    provider: null,
    hasError: false,
  });

  // Track the user's login status.
  const [loggedIn, setLoggedIn] = useState(() => AuthService.loggedIn());

  // Apollo useQuery to fetch user data.
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
      setUserState((prevState) => ({ ...prevState, hasError: true }));
    },
  });

  // Sync the user data with the state whenever the query returns new data.
  useEffect(() => {
    if (!userLoading && userData?.getMe) {
      setUserState({
        user: { ...userData.getMe, loggedIn: true },
        provider: userData.getMe.roleProvider || null,
        hasError: false,
      });
    }
  }, [userLoading, userData]);

  // Memoize the value to avoid unnecessary re-renders.
  const value = useMemo(
    () => ({
      ...userState,
      refetchUser,
      userLoading,
      userError,
      setLoggedIn,
    }),
    [userState, refetchUser, userLoading, userError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
