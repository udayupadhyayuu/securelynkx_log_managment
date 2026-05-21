import { useState } from "react";

import { loginUser } from "../services/api";

function Login({ setUser }) {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin() {
    if (!username || !password) {
      setError("Please enter username and password");

      return;
    }

    setLoading(true);

    setError("");

    try {
      const result = await loginUser(username, password);

      if (result.status === "success") {
        const userData = {
          username,

          role: result.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server Error");
    }

    setLoading(false);
  }

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-900
      via-blue-900
      to-blue-600
      px-4
    "
    >
      {/* CARD */}

      <div
        className="
        w-full
        max-w-md
        bg-white/95
        backdrop-blur
        rounded-3xl
        shadow-2xl
        p-8
      "
      >
        {/* LOGO */}

        <div className="text-center mb-8">
          <div
            className="
            w-20
            h-20
            mx-auto
            rounded-3xl
            bg-blue-600
            flex
            items-center
            justify-center
            text-white
            text-3xl
            font-bold
            shadow-lg
            mb-5
          "
          >
            S
          </div>

          <h1
            className="
            text-4xl
            font-bold
            text-gray-800
          "
          >
            Securelynkx
          </h1>

          <p
            className="
            text-gray-500
            mt-2
          "
          >
            Support Management System
          </p>
        </div>

        {/* USERNAME */}

        <div className="mb-4">
          <label
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
          "
          >
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-4
            py-3
            focus:outline-none
            focus:ring-4
            focus:ring-blue-200
            transition
          "
          />
        </div>

        {/* PASSWORD */}

        <div className="mb-4">
          <label
            className="
            block
            text-sm
            font-medium
            text-gray-700
            mb-2
          "
          >
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-4
              py-3
              pr-12
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
              transition
            "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
            bg-red-100
            text-red-600
            px-4
            py-3
            rounded-2xl
            mb-4
            text-sm
          "
          >
            {error}
          </div>
        )}

        {/* BUTTON */}

        <button
          onClick={handleLogin}
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
          shadow-lg
        "
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
