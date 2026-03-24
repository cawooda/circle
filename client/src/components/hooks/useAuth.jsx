import { useContext } from "react";
import { useAuth } from "../../contexts/UserContext"; // Assuming you use context for auth

export const useAuth = () => {
  const { user } = useAuth(UserContext);
  return { isAuthenticated: !!user };
};
