import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ user }) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div
      className="
      w-20
      md:w-72
      bg-gray-950
      text-white
      min-h-screen
      p-4
      md:p-6
      flex
      flex-col
      justify-between
    "
    >
      <div>
        {/* LOGO */}

        <div
          className="
          text-center
          mb-10
        "
        >
          <h1
            className="
            text-2xl
            md:text-4xl
            font-bold
          "
          >
            SLX
          </h1>
        </div>

        {/* MENU */}

        <ul className="space-y-3">
          {/* DASHBOARD */}

          <li
            onClick={() => navigate("/dashboard")}
            className={`
              p-4
              rounded-2xl
              flex
              items-center
              justify-center
              md:justify-start
              gap-3
              cursor-pointer
              transition

              ${
                location.pathname === "/dashboard"
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }
            `}
          >
            <i className="fa fa-house"></i>

            <span className="hidden md:block">Dashboard</span>
          </li>

          {/* ADD LOG */}

          <li
            onClick={() => navigate("/add-log")}
            className={`
              p-4
              rounded-2xl
              flex
              items-center
              justify-center
              md:justify-start
              gap-3
              cursor-pointer
              transition

              ${
                location.pathname === "/add-log"
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }
            `}
          >
            <i className="fa fa-plus"></i>

            <span className="hidden md:block">Add Log</span>
          </li>

          {/* LOGS */}

          <li
            onClick={() => navigate("/logs")}
            className={`
              p-4
              rounded-2xl
              flex
              items-center
              justify-center
              md:justify-start
              gap-3
              cursor-pointer
              transition

              ${
                location.pathname === "/logs"
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }
            `}
          >
            <i className="fa fa-table"></i>

            <span className="hidden md:block">Logs</span>
          </li>

          {/* ADMIN */}

          {user.role.toLowerCase() === "admin" && (
            <>
              {/* REPORTS */}

              <li
                onClick={() => navigate("/reports")}
                className={`
                  p-4
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-3
                  cursor-pointer
                  transition

                  ${
                    location.pathname === "/reports"
                      ? "bg-blue-600"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                <i className="fa fa-chart-line"></i>

                <span className="hidden md:block">Reports</span>
              </li>

              {/* USERS */}

              <li
                onClick={() => navigate("/users")}
                className={`
                  p-4
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-3
                  cursor-pointer
                  transition

                  ${
                    location.pathname === "/users"
                      ? "bg-blue-600"
                      : "hover:bg-gray-800"
                  }
                `}
              >
                <i className="fa fa-users"></i>

                <span className="hidden md:block">Users</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* PROFILE */}

      <div
        className="
        bg-gray-900
        rounded-2xl
        p-4
        hidden
        md:block
      "
      >
        <p className="text-sm text-gray-400">Logged in as</p>

        <h3 className="font-bold mt-1">{user.username}</h3>
      </div>
    </div>
  );
}

export default Sidebar;
