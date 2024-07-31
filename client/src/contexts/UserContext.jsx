import React, { createContext, useState, useEffect, useContext } from "react";

//import useQuery to operate query
import { useQuery } from "@apollo/client";
//specific query for user
import { QUERY_USER_BY_ID } from "../utils/queries"; // Adjust the path as necessary
import AuthService from "../utils/auth";

// Create a context with a default value
const UserContext = createContext();

// Create a custom hook for easy access to the context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const userId = AuthService?.getProfile()?.authenticatedPerson?._id || false;

  const { loading, error, data } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId, // Skip query if no userId is available
  });

  useEffect(() => {
    if (data && data.getUserById) {
      setUser(data.getUserById);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
