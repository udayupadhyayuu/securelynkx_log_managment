import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

function LogsTable({ logs = [], loadingLogs }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [sortField, setSortField] = useState("sno");
  const [sortOrder, setSortOrder] = useState("desc");

  // CURRENT USER

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // DATE FORMAT

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN");
  }

  function formatTime(timeValue) {
    if (!timeValue) return "--";

    const date = new Date(timeValue);

    return date
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  }

  // TODAY DATE

  const today = new Date().toLocaleDateString("en-CA");

  // ROLE BASED LOGS

  const roleBasedLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log[1]).toLocaleDateString("en-CA");

      // ADMIN

      if (currentUser?.role === "Admin") {
        return true;
      }

      // USER -> ONLY TODAY OWN LOGS

      return log[7]?.toLowerCase() === currentUser?.username?.toLowerCase();
    });
  }, [logs, currentUser, today]);

  // SEARCH FILTER

  const searchedLogs = useMemo(() => {
    return roleBasedLogs.filter((log) => {
      const searchMatch =
        log[2]?.toLowerCase().includes(search.toLowerCase()) ||
        log[3]?.toLowerCase().includes(search.toLowerCase()) ||
        log[5]?.toLowerCase().includes(search.toLowerCase()) ||
        log[6]?.toLowerCase().includes(search.toLowerCase()) ||
        log[7]?.toLowerCase().includes(search.toLowerCase());

      // DATE FILTER

      const logDate = new Date(log[1]);

      const now = new Date();

      let dateMatch = true;

      if (dateFilter === "today") {
        dateMatch =
          logDate.toLocaleDateString("en-CA") ===
          now.toLocaleDateString("en-CA");
      }

      if (dateFilter === "week") {
        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(now.getDate() - 7);

        dateMatch = logDate >= sevenDaysAgo;
      }

      if (dateFilter === "month") {
        dateMatch =
          logDate.getMonth() === now.getMonth() &&
          logDate.getFullYear() === now.getFullYear();
      }

      return searchMatch && dateMatch;
    });
  }, [roleBasedLogs, search, dateFilter]);

  // SORTING

  const filteredLogs = useMemo(() => {
    const sorted = [...searchedLogs];

    sorted.sort((a, b) => {
      let valueA;
      let valueB;

      switch (sortField) {
        case "sno":
          valueA = Number(a[0]);
          valueB = Number(b[0]);
          break;

        case "date":
          valueA = new Date(a[1]);
          valueB = new Date(b[1]);
          break;

        case "property":
          valueA = a[3]?.toLowerCase();
          valueB = b[3]?.toLowerCase();
          break;

        case "user":
          valueA = a[7]?.toLowerCase();
          valueB = b[7]?.toLowerCase();
          break;

        default:
          valueA = Number(a[0]);
          valueB = Number(b[0]);
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return sorted;
  }, [searchedLogs, sortField, sortOrder]);

  // TODAY COUNT

  const todayLogsCount = roleBasedLogs.filter((log) => {
    const logDate = new Date(log[1]).toLocaleDateString("en-CA");

    return logDate === today;
  }).length;

  // UNIQUE PROPERTIES

  const uniqueProperties = new Set(roleBasedLogs.map((log) => log[3])).size;

  // LAST LOG TIME

  const latestLog =
    filteredLogs.length > 0
      ? [...filteredLogs].sort((a, b) => Number(b[0]) - Number(a[0]))[0]
      : null;

  const lastLogTime = latestLog
    ? `${formatDate(latestLog[1])} • ${formatTime(latestLog[4])}`
    : "--";

  // SORT FUNCTION

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // COPY TABLE

  const copyTable = async () => {
    let html = `
      <table border="1" style="border-collapse: collapse; width:100%;">
        <tr style="background:#2563eb;color:white;">
          <th style="padding:8px;">S No</th>
          <th style="padding:8px;">Date</th>
          <th style="padding:8px;">Assigned By</th>
          <th style="padding:8px;">Property</th>
          <th style="padding:8px;">Time</th>
          <th style="padding:8px;">Purpose</th>
          <th style="padding:8px;">Remarks</th>
        </tr>
    `;

    filteredLogs.forEach((log) => {
      html += `
        <tr>
          <td style="padding:8px;">${log[0]}</td>
          <td style="padding:8px;">${formatDate(log[1])}</td>
          <td style="padding:8px;">${log[2]}</td>
          <td style="padding:8px;">${log[3]}</td>
          <td style="padding:8px;">${formatTime(log[4])}</td>
          <td style="padding:8px;">${log[5]}</td>
          <td style="padding:8px;">${log[6]}</td>
        </tr>
      `;
    });

    html += `</table>`;

    const blob = new Blob([html], {
      type: "text/html",
    });

    const data = [
      new ClipboardItem({
        "text/html": blob,
      }),
    ];

    await navigator.clipboard.write(data);
    toast.success("Table copied successfully ✅");
  };

  // DOWNLOAD XLS

  const downloadLogs = () => {
    const data = filteredLogs.map((log) => ({
      "S No": log[0],
      Date: formatDate(log[1]),
      "Assigned By": log[2],
      Property: log[3],
      Time: formatTime(log[4]),
      Purpose: log[5],
      Remarks: log[6],
      User: log[7],
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(
      fileData,
      `${currentUser?.role === "Admin" ? "All_Logs" : "My_Logs"}.xlsx`,
    );
  };

  // COPY EMAIL FORMAT

  const copyEmailFormat = async () => {
    let html = `
      <div style="font-family:Arial,sans-serif;">
        <p>Good Evening Team,</p>

        <p>
          Please find today's updates below:
        </p>

        <table border="1" style="border-collapse:collapse;width:100%;">
          <tr style="background:#2563eb;color:white;">
            <th style="padding:8px;">Property</th>
            <th style="padding:8px;">Purpose</th>
            <th style="padding:8px;">Remarks</th>
          </tr>
    `;

    filteredLogs.forEach((log) => {
      html += `
        <tr>
          <td style="padding:8px;">${log[3]}</td>
          <td style="padding:8px;">${log[5]}</td>
          <td style="padding:8px;">${log[6]}</td>
        </tr>
      `;
    });

    html += `
        </table>

        <br/>

        <p>Regards,<br/>${currentUser?.username}</p>
      </div>
    `;

    const blob = new Blob([html], {
      type: "text/html",
    });

    const data = [
      new ClipboardItem({
        "text/html": blob,
      }),
    ];

    await navigator.clipboard.write(data);

    toast.success("Email format copied!");
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-sm
        p-6
        md:p-8
      "
    >
      {/* HEADER */}

      <div className="mb-8">
        {/* TOP */}

        <div
          className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-5
      mb-6
    "
        >
          {/* TITLE */}

          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              {currentUser?.role === "Admin" ? "All Logs" : "My Logs"}
            </h2>

            <p className="text-gray-500 mt-2 text-lg">
              Latest support activities
            </p>
          </div>

          {/* FILTERS */}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDateFilter("today")}
              className={`
          px-4
          py-2
          rounded-2xl
          text-sm
          font-medium
          transition

          ${
            dateFilter === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
            >
              Today
            </button>

            <button
              onClick={() => setDateFilter("week")}
              className={`
          px-4
          py-2
          rounded-2xl
          text-sm
          font-medium
          transition

          ${
            dateFilter === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
            >
              This Week
            </button>

            <button
              onClick={() => setDateFilter("month")}
              className={`
          px-4
          py-2
          rounded-2xl
          text-sm
          font-medium
          transition

          ${
            dateFilter === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
            >
              This Month
            </button>

            <button
              onClick={() => setDateFilter("all")}
              className={`
          px-4
          py-2
          rounded-2xl
          text-sm
          font-medium
          transition

          ${
            dateFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
            >
              All
            </button>
          </div>
        </div>

        {/* STATS */}

        <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-4
      mb-6
    "
        >
          <div
            className="
        bg-blue-50
        border
        border-blue-100
        rounded-3xl
        p-5
      "
          >
            <p className="text-sm text-blue-600 font-medium">Today's Logs</p>

            <h3 className="text-3xl font-bold text-blue-700 mt-2">
              {todayLogsCount}
            </h3>
          </div>

          <div
            className="
        bg-green-50
        border
        border-green-100
        rounded-3xl
        p-5
      "
          >
            <p className="text-sm text-green-600 font-medium">Properties</p>

            <h3 className="text-3xl font-bold text-green-700 mt-2">
              {uniqueProperties}
            </h3>
          </div>

          <div
            className="
        bg-purple-50
        border
        border-purple-100
        rounded-3xl
        p-5
      "
          >
            <p className="text-sm text-purple-600 font-medium">Last Log</p>

            <h3 className="text-lg font-bold text-purple-700 mt-2">
              {lastLogTime}
            </h3>
          </div>

          <div
            className="
        bg-orange-50
        border
        border-orange-100
        rounded-3xl
        p-5
      "
          >
            <p className="text-sm text-orange-600 font-medium">Showing Logs</p>

            <h3 className="text-3xl font-bold text-orange-700 mt-2">
              {filteredLogs.length}
            </h3>
          </div>
        </div>

        {/* ACTIONS */}

        <div
          className="
      flex
      flex-col
      xl:flex-row
      gap-4
      xl:items-center
      xl:justify-between
    "
        >
          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        border
        border-gray-300
        rounded-2xl
        px-5
        py-4
        w-full
        xl:w-[420px]
        focus:outline-none
        focus:ring-4
        focus:ring-blue-200
      "
          />

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyTable}
              className="
          bg-blue-600
          hover:bg-blue-700
          hover:scale-[1.02]
          active:scale-[0.98]
          text-white
          px-6
          py-4
          rounded-2xl
          font-semibold
          transition
        "
            >
              Copy Table
            </button>

            <button
              onClick={copyEmailFormat}
              className="
          bg-purple-600
          hover:bg-purple-700
          hover:scale-[1.02]
          active:scale-[0.98]
          text-white
          px-6
          py-4
          rounded-2xl
          font-semibold
          transition
        "
            >
              Copy Email
            </button>

            <button
              onClick={downloadLogs}
              className="
          bg-green-600
          hover:bg-green-700
          hover:scale-[1.02]
          active:scale-[0.98]
          text-white
          px-6
          py-4
          rounded-2xl
          font-semibold
          transition
        "
            >
              Download XLS
            </button>
          </div>
        </div>
      </div>

      {/* LOADING */}

      {loadingLogs ? (
        <div
          className="
            py-16
            text-center
            text-gray-500
            text-lg
          "
        >
          Loading logs...
        </div>
      ) : (
        <div
          className="
            overflow-x-auto
            rounded-3xl
            border
            border-gray-200
          "
        >
          <table
            className="
              w-full
              min-w-[1300px]
              border-collapse
            "
          >
            {/* HEADER */}

            <thead
              className="
                sticky
                top-0
                z-10
                bg-blue-600
                text-white
              "
            >
              <tr>
                <th
                  className="
                    px-4
                    py-5
                    text-left
                    whitespace-nowrap
                    cursor-pointer
                  "
                  onClick={() => handleSort("sno")}
                >
                  S No
                </th>

                <th
                  className="
                    px-4
                    py-5
                    text-left
                    whitespace-nowrap
                    cursor-pointer
                  "
                  onClick={() => handleSort("date")}
                >
                  Date
                </th>

                <th className="px-4 py-5 text-left whitespace-nowrap">
                  Assigned By
                </th>

                <th
                  className="
                    px-4
                    py-5
                    text-left
                    whitespace-nowrap
                    cursor-pointer
                  "
                  onClick={() => handleSort("property")}
                >
                  Property
                </th>

                <th className="px-4 py-5 text-left whitespace-nowrap">Time</th>

                <th className="px-4 py-5 text-left whitespace-nowrap">
                  Purpose
                </th>

                <th className="px-4 py-5 text-left whitespace-nowrap">
                  Remarks
                </th>

                <th
                  className="
                    px-4
                    py-5
                    text-left
                    whitespace-nowrap
                    cursor-pointer
                  "
                  onClick={() => handleSort("user")}
                >
                  User
                </th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="
                      border-b
                      border-gray-100
                      odd:bg-white
                      even:bg-gray-50
                      hover:bg-blue-50
                      transition
                    "
                  >
                    <td className="px-4 py-5 align-top whitespace-nowrap">
                      {log[0]}
                    </td>

                    <td className="px-4 py-5 align-top whitespace-nowrap">
                      {formatDate(log[1])}
                    </td>

                    <td className="px-4 py-5 align-top whitespace-nowrap">
                      {log[2]}
                    </td>

                    <td className="px-4 py-5 align-top whitespace-nowrap font-medium">
                      {log[3]}
                    </td>

                    <td className="px-4 py-5 align-top whitespace-nowrap">
                      {formatTime(log[4])}
                    </td>

                    <td
                      className="
                        px-4
                        py-5
                        align-top
                        max-w-[240px]
                        leading-7
                        break-words
                        whitespace-pre-wrap
                      "
                    >
                      {log[5]}
                    </td>

                    <td
                      className="
                        px-4
                        py-5
                        align-top
                        max-w-[520px]
                        text-gray-700
                        leading-7
                        break-words
                        whitespace-pre-wrap
                      "
                    >
                      {log[6]}
                    </td>

                    <td className="px-4 py-5 align-top">
                      <span
                        className="
                          bg-blue-100
                          text-blue-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          whitespace-nowrap
                        "
                      >
                        {log[7]}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="
                      text-center
                      py-16
                      text-gray-500
                      text-lg
                    "
                  >
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LogsTable;
