function Navbar({ user, darkMode, setDarkMode }) {
  function logout() {
    localStorage.removeItem("user");

    location.reload();
  }

  return (
    <div
      className="
      flex
      items-center
      justify-between
      bg-white dark:bg-gray-900
      rounded-3xl
      shadow-sm
      p-6
      mb-6
    "
    >
      <div>
        <h2
          className="
          text-3xl
          font-bold
          dark:text-white
        "
        >
          Welcome, {user.username}
        </h2>

        <p
          className="
          text-gray-500 dark:text-gray-300
          mt-1
        "
        >
          {user.role}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="
      bg-gray-200
      dark:bg-gray-700
      dark:text-white
      px-4
      py-3
      rounded-2xl
      font-semibold
      transition
    "
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          onClick={logout}
          className="
      bg-red-500
      hover:bg-red-600
      text-white
      px-5
      py-3
      rounded-2xl
      font-semibold
      transition
    "
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
