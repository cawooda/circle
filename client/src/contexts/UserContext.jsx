import React, { createContext, useState, useEffect, useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_BY_ID } from "../utils/queries";
import AuthService from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Splash from "../components/Splash";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const profile = AuthService.getProfile();

  const userId = profile?.authenticatedPerson?._id;
  console.log("userId", userId);
  const { loading, error, data, refetch } = useQuery(QUERY_USER_BY_ID, {
    skip: !userId,
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
      window.location.reload(false);
      setRetryCount(retryCount + 1);
      refetch(); // Retry the query
    }
  };

  if (loading) return <Splash />;

  // if (hasError) {
  //   refetch(); // Retry the query
  //   window.location.reload(false);
  //   return (
  //     <div>
  //       <p>
  //         We encountered an issue fetching your data. Please try again later.
  //       </p>
  //       <Button onClick={handleRetry}>Refresh</Button>
  //     </div>
  //   );
  // }

  return (
    <UserContext.Provider value={{ user, setUser, refetch, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
