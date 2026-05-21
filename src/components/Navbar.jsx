function Navbar({ user }) {
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
      bg-white
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
        "
        >
          Welcome, {user.username}
        </h2>

        <p
          className="
          text-gray-500
          mt-1
        "
        >
          {user.role}
        </p>
      </div>

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
  );
}

export default Navbar;
