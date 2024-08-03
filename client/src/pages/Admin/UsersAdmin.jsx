import { useEffect, useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import UserAdminRow from "../../components/AdminComponents/UserAdminRow";
import { TOGGLE_USER_ROLE } from "../../utils/mutations";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const { adminData, loading, error } = useAdmin();
  useEffect(() => {
    setUsers(adminData);
  }, [adminData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
  }

  return (
    <div>
      {users.length > 0 ? (
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
