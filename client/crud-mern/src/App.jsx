import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [id, setId] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const createOrUpdateUser = async (e) => {
    e.preventDefault();
    try {
      if (!isEditing) {
        await axios.post("http://localhost:3001/createUser", user);
      } else {
        await axios.put(`http://localhost:3001/users/${id}`, user);
        setIsEditing(false);
      }
      fetchData();
      setUser({});
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleIsEditing = async (id) => {
    setId(id);
    setIsEditing(true);
    await getUserById(id);
  };

  const handleChangeInput = (e) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const deleteUser = async (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      <form
        onSubmit={createOrUpdateUser}
        className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit User" : "Create User"}
        </h2>
        <input
          type="text"
          name="name"
          value={user.name || ""}
          onChange={handleChangeInput}
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          name="age"
          value={user.age || ""}
          onChange={handleChangeInput}
          placeholder="Age"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          name="username"
          value={user.username || ""}
          onChange={handleChangeInput}
          placeholder="Username"
          className="w-full p-2 border rounded mb-4"
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          {isEditing ? "Update User" : "Create User"}
        </button>
      </form>

      <div className="w-full max-w-lg">
        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="bg-white shadow-md rounded-lg p-4 mb-3">
              <h3 className="text-lg font-bold">{u.name}</h3>
              <p>Age: {u.age}</p>
              <p>Username: {u.username}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleIsEditing(u._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
