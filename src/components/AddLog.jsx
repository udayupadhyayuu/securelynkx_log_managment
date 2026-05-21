import { useState } from "react";

import { saveLog } from "../services/api";

function AddLog({ user }) {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],

    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    property: "",

    assignedBy: "",

    purpose: "",

    remarks: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const payload = {
        ...formData,

        user: user.username,
      };

      const result = await saveLog(payload);

      if (result.status === "success") {
        setMessage("Log Saved Successfully");

        setFormData({
          date: new Date().toISOString().split("T")[0],

          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          property: "",

          assignedBy: "",

          purpose: "",

          remarks: "",
        });
      } else {
        setMessage("Failed to save log");
      }
    } catch (error) {
      setMessage("Server Error");
    }

    setLoading(false);
  }

  return (
    <div
      className="
      bg-white
      rounded-3xl
      shadow-sm
      p-5
      md:p-6
    "
    >
      {/* HEADER */}

      <div className="mb-5">
        <h1
          className="
          text-2xl
          font-bold
        "
        >
          Add Support Log
        </h1>

        <p
          className="
          text-gray-500
          mt-1
        "
        >
          Create support activity
        </p>
      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* DATE + TIME */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              bg-gray-50
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
            "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Time
            </label>

            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              bg-gray-50
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
            "
            />
          </div>
        </div>

        {/* PROPERTY + ASSIGNED */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Property
            </label>

            <input
              type="text"
              name="property"
              value={formData.property}
              onChange={handleChange}
              placeholder="Property name"
              required
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              bg-gray-50
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
            "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Assigned By
            </label>

            <input
              type="text"
              name="assignedBy"
              value={formData.assignedBy}
              onChange={handleChange}
              placeholder="Assigned by"
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              bg-gray-50
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
            "
            />
          </div>
        </div>

        {/* PURPOSE */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Purpose
          </label>

          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Internet Issue"
            className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-4
            py-3
            bg-gray-50
            focus:outline-none
            focus:ring-4
            focus:ring-blue-200
          "
          />
        </div>

        {/* REMARKS */}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Remarks
          </label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Write detailed remarks..."
            className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-4
            py-3
            min-h-[120px]
            resize-none
            bg-gray-50
            focus:outline-none
            focus:ring-4
            focus:ring-blue-200
          "
          ></textarea>
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          py-3
          rounded-2xl
          font-semibold
          transition
        "
        >
          {loading ? "Saving..." : "Save Log"}
        </button>

        {/* MESSAGE */}

        {message && (
          <p className="text-center text-green-600 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

export default AddLog;
