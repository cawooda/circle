import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";

import { QUERY_ALL_USERS } from "../utils/queries"; // Adjust the path as necessary
import { useUser } from "./UserContext";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user, refetchUser } = useUser();

  const [adminData, setAdminData] = useState({});
  const isAdmin = user.roleAdmin || user.roleSuperAdmin || null;
  const { loading, error, data } = useQuery(QUERY_ALL_USERS, {
    variables: { id: user._id },
    skip: !user._id, // Skip query if no userId is available
  });

  useEffect(() => {
    if (data && data.getAllUsers) {
      setAdminData(data.getAllUsers);
    }
  }, [data, loading]);

  return (
    <AdminContext.Provider value={{ adminData, loading, error }}>
      {children}
    </AdminContext.Provider>
  );
};
