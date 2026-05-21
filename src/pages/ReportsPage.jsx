import { useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

function ReportsPage({ user, logs }) {
  // FILTER STATES

  const [filterUser, setFilterUser] = useState("");

  const [filterProperty, setFilterProperty] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  // FORMAT DATE

  function formatDate(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-IN");
  }

  // FILTER LOGS

  const filteredLogs = logs.filter((log) => {
    const userValue = (log.user || log[7] || "").toLowerCase();

    const propertyValue = (log.property || log[3] || "").toLowerCase();

    const logDate = new Date(log.date || log[1]).toLocaleDateString("en-CA");

    const userMatch =
      !filterUser || userValue.includes(filterUser.toLowerCase());

    const propertyMatch =
      !filterProperty || propertyValue.includes(filterProperty.toLowerCase());

    const fromMatch = !fromDate || logDate >= fromDate;

    const toMatch = !toDate || logDate <= toDate;

    return userMatch && propertyMatch && fromMatch && toMatch;
  });

  // TOTAL LOGS

  const totalLogs = filteredLogs.length;

  // TODAY LOGS

  const today = new Date().toLocaleDateString("en-CA");

  const todayLogs = filteredLogs.filter((log) => {
    const logDate = new Date(log.date || log[1]).toLocaleDateString("en-CA");

    return logDate === today;
  }).length;

  // ACTIVE USERS

  const activeUsers = new Set(filteredLogs.map((log) => log.user || log[7]))
    .size;

  // TOP USER

  const userCounts = {};

  filteredLogs.forEach((log) => {
    const username = log.user || log[7];

    userCounts[username] = (userCounts[username] || 0) + 1;
  });

  const topUser =
    Object.keys(userCounts).length > 0
      ? Object.keys(userCounts).reduce((a, b) =>
          userCounts[a] > userCounts[b] ? a : b,
        )
      : "-";

  // DOWNLOAD XLS

  function downloadExcel() {
    const excelData = filteredLogs.map((log) => ({
      SNo: log.sno || log[0],

      Date: formatDate(log.date || log[1]),

      AssignedBy: log.assignedBy || log[2],

      Property: log.property || log[3],

      Time: log.time || log[4],

      Purpose: log.purpose || log[5],

      Remarks: log.remarks || log[6],

      User: log.user || log[7],
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "SLX_Reports.xlsx");
  }

  // DOWNLOAD PDF

  function downloadPDF() {
    const doc = new jsPDF();

    const tableData = filteredLogs.map((log) => [
      log.sno || log[0],

      formatDate(log.date || log[1]),

      log.property || log[3],

      log.purpose || log[5],

      log.user || log[7],
    ]);

    autoTable(doc, {
      head: [["S No", "Date", "Property", "Purpose", "User"]],

      body: tableData,
    });

    doc.save("SLX_Report.pdf");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}

      <Sidebar user={user} />

      {/* MAIN */}

      <div className="flex-1 p-4 md:p-8">
        {/* NAVBAR */}

        <Navbar user={user} />

        {/* TITLE */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Reports</h1>

          <p className="text-gray-500 mt-2">Analytics, filters and exports</p>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Filter by user"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="
              bg-white
              border
              border-gray-300
              px-4
              py-3
              rounded-2xl
              shadow-sm
            "
          />

          <input
            type="text"
            placeholder="Filter by property"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="
              bg-white
              border
              border-gray-300
              px-4
              py-3
              rounded-2xl
              shadow-sm
            "
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="
              bg-white
              border
              border-gray-300
              px-4
              py-3
              rounded-2xl
              shadow-sm
            "
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="
              bg-white
              border
              border-gray-300
              px-4
              py-3
              rounded-2xl
              shadow-sm
            "
          />

          <button
            onClick={() => {
              setFilterUser("");

              setFilterProperty("");

              setFromDate("");

              setToDate("");
            }}
            className="
              bg-gray-700
              hover:bg-gray-800
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Reset
          </button>

          <button
            onClick={downloadExcel}
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Download XLS
          </button>

          <button
            onClick={downloadPDF}
            className="
              bg-red-600
              hover:bg-red-700
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Download PDF
          </button>
        </div>

        {/* COUNT */}

        <p className="text-gray-500 mb-6">Showing {filteredLogs.length} logs</p>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-gray-500">Total Logs</h3>

            <p className="text-5xl font-bold mt-4 text-blue-600">{totalLogs}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-gray-500">Today's Logs</h3>

            <p className="text-5xl font-bold mt-4 text-green-600">
              {todayLogs}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-gray-500">Active Users</h3>

            <p className="text-5xl font-bold mt-4 text-purple-600">
              {activeUsers}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-gray-500">Top User</h3>

            <p className="text-4xl font-bold mt-4 text-orange-600">{topUser}</p>
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl shadow-sm p-6 overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left rounded-l-2xl">S No</th>

                <th className="px-4 py-4 text-left">Date</th>

                <th className="px-4 py-4 text-left">Assigned By</th>

                <th className="px-4 py-4 text-left">Property</th>

                <th className="px-4 py-4 text-left">Time</th>

                <th className="px-4 py-4 text-left">Purpose</th>

                <th className="px-4 py-4 text-left">Remarks</th>

                <th className="px-4 py-4 text-left rounded-r-2xl">User</th>
              </tr>
            </thead>

            <tbody>
              {[...filteredLogs].reverse().map((log, index) => (
                <tr
                  key={index}
                  className="
                      border-b
                      border-gray-100
                      hover:bg-gray-50
                    "
                >
                  <td className="px-4 py-5">{log.sno || log[0]}</td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    {formatDate(log.date || log[1])}
                  </td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    {log.assignedBy || log[2]}
                  </td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    {log.property || log[3]}
                  </td>

                  <td className="px-4 py-5 whitespace-nowrap">
                    {log.time || log[4]}
                  </td>

                  <td className="px-4 py-5 max-w-[220px]">
                    {log.purpose || log[5]}
                  </td>

                  <td className="px-4 py-5 max-w-[420px] leading-8 text-gray-700">
                    {log.remarks || log[6]}
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className="
                          bg-blue-100
                          text-blue-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "
                    >
                      {log.user || log[7]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
