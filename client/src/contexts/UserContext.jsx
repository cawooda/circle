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
    skip: !profile, // Skip query if no userId is available
  });

  useEffect(() => {
    console.log(data);
    if (data && data.getMe) {
      setUser(data.getMe);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
