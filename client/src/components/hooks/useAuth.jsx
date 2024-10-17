import { useContext } from "react";
import { useUser } from "../../contexts/UserContext"; // Assuming you use context for auth

export const useAuth = () => {
  const { user } = useUser(UserContext);
  return { isAuthenticated: !!user };
};
