import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

import { getUsers } from "../services/api";
import Navbar from "../components/Navbar";

import LogsTable from "../components/LogsTable";

function Dashboard({ user, logs, loadingLogs, darkMode, setDarkMode }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="
      flex
      min-h-screen
      bg-gray-100
    "
    >
      <Sidebar user={user} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* STATS */}

        {user.role === "Admin" && (
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-5
            mb-6
          "
          >
            {/* TOTAL LOGS */}

            <div
              className="
              bg-white
              rounded-3xl
              p-6
              shadow-sm
            "
            >
              <h3 className="text-gray-500">Total Logs</h3>

              <p
                className="
                text-4xl
                font-bold
                mt-3
                text-blue-600
              "
              >
                {logs.length}
              </p>
            </div>

            {/* TODAY LOGS */}

            <div
              className="
              bg-white
              rounded-3xl
              p-6
              shadow-sm
            "
            >
              <h3 className="text-gray-500">Today's Logs</h3>

              <p
                className="
                text-4xl
                font-bold
                mt-3
                text-green-600
              "
              >
                {
                  logs.filter((log) => {
                    const today = new Date().toLocaleDateString("en-CA");

                    const logDate = new Date(log[1]).toLocaleDateString(
                      "en-CA",
                    );

                    return logDate === today;
                  }).length
                }
              </p>
            </div>

            {/* ACTIVE USERS */}

            <div
              className="
              bg-white
              rounded-3xl
              p-6
              shadow-sm
            "
            >
              <h3 className="text-gray-500">Active Users</h3>

              <p
                className="
                text-4xl
                font-bold
                mt-3
                text-purple-600
              "
              >
                {
                  users.filter((item) => item[7]?.toLowerCase() === "active")
                    .length
                }
              </p>
            </div>
            {/* LAST LOG */}

            <div
              className="
    bg-white
    rounded-3xl
    p-6
    shadow-sm
  "
            >
              <h3 className="text-gray-500">Last Log</h3>

              <p
                className="
      text-lg
      font-bold
      mt-3
      text-orange-600
    "
              >
                {logs.length > 0
                  ? `${new Date(logs[logs.length - 1][1]).toLocaleDateString(
                      "en-IN",
                    )} • ${
                      logs[logs.length - 1][3]
                    } by ${logs[logs.length - 1][7]}`
                  : "--"}
              </p>
            </div>
          </div>
        )}

        {/* LOGS TABLE */}

        <LogsTable
          logs={logs}
          loadingLogs={loadingLogs}
          hideStats={user.role === "Admin"}
        />
      </div>
    </div>
  );
}

export default Dashboard;
