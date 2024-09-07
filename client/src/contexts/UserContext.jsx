import React, { createContext, useState, useEffect, useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_BY_ID } from "../utils/queries"; // Adjust the path as necessary
import AuthService from "../utils/auth";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const profile = AuthService.getProfile();
  const userId = profile?.authenticatedPerson?._id || null;

  const { loading, error, data, refetch } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: userId },
    skip: !profile, // Skip query if no userId is available
    onError: () => setHasError(true), // Set hasError state when error occurs
  });

  useEffect(() => {
    if (data && data.getMe) {
      setUser(data.getMe);
      setHasError(false); // Reset error state on successful data fetch
    }
  }, [data]);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      refetch(); // Retry the query
    }
  };

  if (loading) return <p>Loading...</p>;

  if (hasError) {
    return (
      <div>
        <p>
          We encountered an issue fetching your data. Please try again later.
        </p>
        <Button onClick={() => window.location.reload(false)}>Refresh</Button>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
