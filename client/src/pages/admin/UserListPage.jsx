import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Get userInfo from Redux store
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo || !userInfo.token) {
        setError("You must be logged in as an admin");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error details:", error.response?.data);
        setError(error.response?.data?.message || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [userInfo]);

  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="text-red-500 text-center py-10">
        Access denied. Admin privileges required.
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Admin</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.userName}</td>
                <td className="py-2 px-4 border">
                  {user.isAdmin ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border">
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;
