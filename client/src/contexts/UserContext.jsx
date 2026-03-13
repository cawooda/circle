import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { LOGIN } from "../utils/mutations";
import AuthService from "../utils/auth";

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserProvider = ({ children }) => {
  const token = AuthService.getToken();
  const loggedIn = Boolean(token) && AuthService.loggedIn();

  const {
    loading: queryLoading,
    error: queryError,
    data: userData,
    refetch: refetchUser,
  } = useQuery(GET_ME, {
    skip: !loggedIn,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const user = useMemo(() => {
    const me = userData?.getMe;

    if (!loggedIn || me?.success === false || !me?.user) {
      return null;
    }

    return {
      ...me.user,
      loggedIn: true,
    };
  }, [loggedIn, userData]);

  const provider = useMemo(
    () => user?.provider ?? user?.roleProvider ?? null,
    [user]
  );

  const userError = useMemo(() => {
    if (queryError) {
      return queryError;
    }

    const me = userData?.getMe;

    if (loggedIn && me?.success === false) {
      return new Error(me.message || "Failed to load the current user.");
    }

    return null;
  }, [loggedIn, queryError, userData]);

  const value = useMemo(
    () => ({
      user,
      provider,
      loggedIn,
      refetchUser,
      userLoading: loggedIn ? queryLoading : false,
      userError,
    }),
    [loggedIn, provider, queryLoading, refetchUser, user, userError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
