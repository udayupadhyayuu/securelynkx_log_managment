import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import LogsTable from "../components/LogsTable";

function LogsPage({ user, logs, loadingLogs }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} />

        <LogsTable logs={logs} loadingLogs={loadingLogs} />
      </div>
    </div>
  );
}

export default LogsPage;
