import { createContext, useState, useContext } from "react";
import { QUERY_USER_BY_ID } from "../utils/queries";
import AuthService from "../utils/auth";

//create our user Context using createContext
export const UserContext = createContext();

// Create a custom hook that allows easy access to our ThemeContext values
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
  //creating our state
  const [currentUser, setCurrentUser] = useState({
    _id: null,
    first: null,
    last: null,
    mobile: null,
    email: null,
  });

  const getUser = () => {
    const { loading, data } = useQuery(QUERY_USER_BY_ID, {
      variables: { id: AuthService.getProfile()._id },
    });
    const user = data?.user || [];
    return setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}
