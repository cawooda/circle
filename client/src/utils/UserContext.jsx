import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_BY_ID } from "../utils/queries";
import AuthService from "../utils/auth";

// Create user context
export const UserContext = createContext();

// Create a custom hook
//export const useCurrentUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const { loading, data } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: AuthService.getProfile()._id },
  });

  useEffect(() => {
    if (data) {
      setCurrentUser(data.user);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
