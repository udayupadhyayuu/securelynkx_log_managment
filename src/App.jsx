import { Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLogs } from "./services/api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddLogPage from "./pages/AddLogPage";
import LogsPage from "./pages/LogsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  // GLOBAL LOGS STATE

  const [logs, setLogs] = useState([]);

  const [loadingLogs, setLoadingLogs] = useState(true);

  // FETCH ONLY ONCE

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoadingLogs(true);

      const data = await getLogs();

      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoadingLogs(false);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastStyle={{
          borderRadius: "18px",
          background: "#ffffff",
          color: "#111827",
          fontSize: "15px",
          fontWeight: "500",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #f3f4f6",
        }}
      />

      {/* ROUTES */}

      <Routes>
        {/* LOGIN */}

        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} logs={logs} loadingLogs={loadingLogs} />
            ) : (
              <Login setUser={() => location.reload()} />
            )
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} logs={logs} loadingLogs={loadingLogs} />
            </ProtectedRoute>
          }
        />

        {/* ADD LOG */}

        <Route
          path="/add-log"
          element={
            <ProtectedRoute>
              <AddLogPage user={user} loadLogs={loadLogs} />
            </ProtectedRoute>
          }
        />

        {/* LOGS */}

        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage user={user} logs={logs} loadingLogs={loadingLogs} />
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage user={user} logs={logs} />
            </ProtectedRoute>
          }
        />

        {/* USERS */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
