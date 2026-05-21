import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import LogsTable from "../components/LogsTable";

function Dashboard({ user, logs, loadingLogs }) {
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
        <Navbar user={user} />

        {/* STATS */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
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

                  const logDate = new Date(log[1]).toLocaleDateString("en-CA");

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
              {new Set(logs.map((log) => log[7])).size}
            </p>
          </div>
        </div>

        {/* LOGS TABLE */}

        <LogsTable logs={logs} loadingLogs={loadingLogs} />
      </div>
    </div>
  );
}

export default Dashboard;
