import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";

import UserAdminRow from "../../components/AdminComponents/UserAdminRow";

import Splash from "../../components/Splash";

export default function UsersAdmin() {
  const { user, userLoading, userError } = useUser();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("users", user?.roleAdmin.users);
    setUsers(user?.roleAdmin.users);
  }, [user]);

  if (userLoading) return <Splash />;
  if (userError) return <p>Error: {userError.message}</p>;

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div>
      {users?.length > 0 ? (
        users.map((user, index) => (
          <UserAdminRow
            index={index}
            key={user._id}
            handleSubmit={handleSubmit}
            user={user}
          />
        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
