import React, { createContext, useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";

import { QUERY_ALL_USERS } from "../utils/queries"; // Adjust the path as necessary
import { useUser } from "./UserContext";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useUser();

  const [adminData, setAdminData] = useState({});

  const {
    loading: adminLoading,
    error: adminError,
    data,
  } = useQuery(QUERY_ALL_USERS, {
    variables: { id: user?._id },
    skip: !user.roleProvider,
  });

  useEffect(() => {
    if (data?.getAllUsers) {
      setAdminData(adminData.getAllUsers);
    }
  }, [data, adminLoading]);

  return (
    <AdminContext.Provider value={{ adminData, adminLoading, adminError }}>
      {children}
    </AdminContext.Provider>
  );
};
