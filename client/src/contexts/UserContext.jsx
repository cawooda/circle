import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_BY_ID } from "../utils/queries"; // Adjust the path as necessary
import AuthService from "../utils/auth";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const profile = AuthService.getProfile();

  const userId = profile?.authenticatedPerson?._id || null;

  const { loading, error, data } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId, // Skip query if no userId is available
  });

  useEffect(() => {
    if (data && data.getMe) {
      setUser(data.getMe);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
