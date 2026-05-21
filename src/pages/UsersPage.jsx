import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { getUsers, createUser, updateUser } from "../services/api";

function UsersPage({ user }) {
  // =========================
  // STATES
  // =========================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // CREATE USER

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);

  const [createError, setCreateError] = useState("");

  const [usernameExists, setUsernameExists] = useState(false);

  // EDIT MODAL

  const [editModal, setEditModal] = useState(false);

  const [editUser, setEditUser] = useState(null);

  const [editUsername, setEditUsername] = useState("");

  const [editPassword, setEditPassword] = useState("");

  const [editConfirmPassword, setEditConfirmPassword] = useState("");

  const [editRole, setEditRole] = useState("user");

  const [editStatus, setEditStatus] = useState("Active");

  const [editLoading, setEditLoading] = useState(false);

  const [editError, setEditError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  // =========================
  // LOAD USERS
  // =========================

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // CHECK USERNAME
  // =========================

  function checkUsername(value) {
    setUsername(value);

    const exists = users.some(
      (item) => item[0]?.toLowerCase()?.trim() === value?.toLowerCase()?.trim(),
    );

    setUsernameExists(exists);
  }

  // =========================
  // CREATE USER
  // =========================

  async function handleCreateUser() {
    setCreateError("");

    if (!username || !password || !confirmPassword) {
      setCreateError("Please fill all fields");

      return;
    }

    if (password !== confirmPassword) {
      setCreateError("Passwords do not match");

      return;
    }

    try {
      setCreateLoading(true);

      const result = await createUser({
        username,

        password,

        role,

        createdBy: user.username,
      });

      if (result.status === "success") {
        toast.success("User created successfully ✅");

        setUsername("");

        setPassword("");

        setConfirmPassword("");

        setRole("user");

        loadUsers();
      } else {
        setCreateError(result.message);

        toast.error(result.message);
      }
    } catch (error) {
      setCreateError("Failed to create user");

      toast.error("Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================

  function openEditModal(userData) {
    setEditUser(userData);

    setEditUsername(userData[0]);

    setEditPassword("");

    setEditConfirmPassword("");

    setEditRole(userData[2]);

    setEditStatus(userData[7]);

    setShowResetPassword(false);

    setEditModal(true);
  }

  // =========================
  // UPDATE USER
  // =========================

  async function handleUpdateUser() {
    setEditError("");

    if (!editUsername) {
      setEditError("Username required");

      return;
    }

    if (showResetPassword && editPassword !== editConfirmPassword) {
      setEditError("Passwords do not match");

      return;
    }

    try {
      setEditLoading(true);

      const result = await updateUser({
        oldUsername: editUser[0],

        username: editUsername,

        password: showResetPassword ? editPassword : editUser[1],

        role: editRole,

        status: editStatus,

        updatedBy: user.username,
      });

      if (result.status === "success") {
        toast.success("User updated successfully ✅");

        setEditModal(false);

        loadUsers();
      }
    } catch (error) {
      setEditError("Failed to update user");

      toast.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  }

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} />

        {/* TITLE */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">User Management</h1>

          <p className="text-gray-500 mt-2">Manage users and access control</p>
        </div>

        {/* CREATE USER */}

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Create User</h2>

            <p className="text-gray-500 mt-1">Add new employee account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => checkUsername(e.target.value)}
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  px-4
                  py-4
                  rounded-2xl
                "
              />

              {username && (
                <div
                  className={`
                    text-sm
                    mt-2
                    px-2

                    ${usernameExists ? "text-red-600" : "text-green-600"}
                  `}
                >
                  {usernameExists
                    ? "Username already exists"
                    : "Username available"}
                </div>
              )}
            </div>

            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  px-4
                  py-4
                  rounded-2xl
                "
              >
                <option value="User">User</option>

                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  px-4
                  py-4
                  rounded-2xl
                  pr-14
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                  w-full
                  bg-gray-50
                  border
                  border-gray-200
                  px-4
                  py-4
                  rounded-2xl
                  pr-14
                "
              />
            </div>
          </div>

          {createError && (
            <div
              className="
                mt-5
                bg-red-50
                border
                border-red-200
                text-red-600
                px-4
                py-3
                rounded-2xl
              "
            >
              {createError}
            </div>
          )}

          <button
            onClick={handleCreateUser}
            disabled={createLoading || usernameExists}
            className="
              mt-6
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              text-white
              px-8
              py-4
              rounded-2xl
              font-semibold
            "
          >
            {createLoading ? "Creating..." : "Create User"}
          </button>
        </div>

        {/* USERS TABLE */}

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">All Users</h2>

              <p className="text-gray-500 mt-1">Manage employee access</p>
            </div>

            <div
              className="
                bg-blue-100
                text-blue-700
                px-4
                py-2
                rounded-2xl
                font-semibold
              "
            >
              {users.length} Users
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-5 text-left rounded-l-3xl">User</th>

                    <th className="px-6 py-5 text-left">Role</th>

                    <th className="px-6 py-5 text-left">Status</th>

                    <th className="px-6 py-5 text-left">Updated By</th>

                    <th className="px-6 py-5 text-left">Updated At</th>

                    <th className="px-6 py-5 text-left rounded-r-3xl">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item, index) => (
                    <tr
                      key={index}
                      className="
                          border-b
                          border-gray-100
                          hover:bg-gray-50
                        "
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-blue-100
                                text-blue-700
                                flex
                                items-center
                                justify-center
                                font-bold
                              "
                          >
                            {item[0]?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">{item[0]}</h3>

                            <p className="text-gray-500 text-sm">
                              Securelynkx User
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <span
                          className={`
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-semibold

                              ${
                                item[2]?.toLowerCase() === "Admin"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            `}
                        >
                          {item[2]}
                        </span>
                      </td>

                      <td className="px-6 py-6">
                        <span
                          className={`
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-semibold

                              ${
                                item[7] === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                        >
                          {item[7]}
                        </span>
                      </td>

                      <td className="px-6 py-6">{item[5] || "-"}</td>

                      <td className="px-6 py-6 whitespace-nowrap">
                        {formatDate(item[6])}
                      </td>

                      <td className="px-6 py-6">
                        <button
                          onClick={() => openEditModal(item)}
                          className="
                              bg-blue-100
                              hover:bg-blue-200
                              text-blue-700
                              px-4
                              py-2
                              rounded-xl
                              text-sm
                              font-semibold
                            "
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}

        {editModal && (
          <div
            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >
            <div
              className="
                bg-white
                w-full
                max-w-lg
                rounded-3xl
                p-8
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Edit User</h2>

                <button
                  onClick={() => setEditModal(false)}
                  className="
                    text-2xl
                    text-gray-500
                  "
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    px-4
                    py-4
                  "
                />

                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    px-4
                    py-4
                  "
                >
                  <option value="User">User</option>

                  <option value="Admin">Admin</option>
                </select>

                <div>
                  <p className="font-semibold mb-3 text-gray-700">
                    Account Status
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* ACTIVE */}

                    <button
                      type="button"
                      onClick={() => setEditStatus("Active")}
                      className={`
        py-4
        rounded-2xl
        font-semibold
        transition
        border-2

        ${
          editStatus === "Active"
            ? "bg-green-600 text-white border-green-600 shadow-lg"
            : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
        }
      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <i className="fa fa-check-circle"></i>

                        <span>Active</span>
                      </div>
                    </button>

                    {/* INACTIVE */}

                    <button
                      type="button"
                      onClick={() => setEditStatus("Inactive")}
                      className={`
        py-4
        rounded-2xl
        font-semibold
        transition
        border-2

        ${
          editStatus === "Inactive"
            ? "bg-red-600 text-white border-red-600 shadow-lg"
            : "bg-white text-gray-600 border-gray-200 hover:border-red-400"
        }
      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <i className="fa fa-ban"></i>

                        <span>Inactive</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* RESET PASSWORD */}

                <div>
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="
      w-full
      bg-gray-100
      hover:bg-gray-200
      text-gray-700
      py-4
      rounded-2xl
      font-semibold
      transition
    "
                  >
                    {showResetPassword
                      ? "Cancel Password Reset"
                      : "Reset Password"}
                  </button>
                </div>

                {/* PASSWORD RESET FIELDS */}

                {showResetPassword && (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="
          w-full
          border
          border-gray-300
          rounded-2xl
          px-4
          py-4
          pr-14
        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
                      >
                        <i
                          className={`fa ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={editConfirmPassword}
                        onChange={(e) => setEditConfirmPassword(e.target.value)}
                        className="
          w-full
          border
          border-gray-300
          rounded-2xl
          px-4
          py-4
          pr-14
        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
                      >
                        <i
                          className={`fa ${
                            showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                )}

                {editError && (
                  <div
                    className="
                      bg-red-100
                      text-red-600
                      px-4
                      py-3
                      rounded-2xl
                    "
                  >
                    {editError}
                  </div>
                )}

                <button
                  onClick={handleUpdateUser}
                  disabled={editLoading}
                  className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-blue-300
                    text-white
                    py-4
                    rounded-2xl
                    font-semibold
                  "
                >
                  {editLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
