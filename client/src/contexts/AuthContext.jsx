import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthService from "../utils/auth";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await AuthService.getMe();
      console.log("current user", currentUser);
      setUser(currentUser);
      setUserLoading(false);
    };
    loadUser();
  }, []);

  const value = useMemo(() => ({ user, userLoading }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
