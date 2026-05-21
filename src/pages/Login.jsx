import { useState, useEffect } from "react";
import { loginUser } from "../services/api";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  async function handleLogin() {
    if (loading) return;
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

        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
        }

        setUser(userData);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server Error");
    }

    setLoading(false);
  }

  // ENTER KEY LOGIN
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
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
          <img
            src="/slx-logo.png"
            alt="Securelynkx"
            className="w-65 mx-auto mb-5 drop-shadow-lg"
          />

          <p className="text-gray-500 mt-2">Support Management System</p>
        </div>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
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
              disabled:bg-gray-100
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
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
                disabled:bg-gray-100
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

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />

          <label className="text-sm text-gray-600">Remember Me</label>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            w-full
            py-3
            rounded-2xl
            font-semibold
            transition
            shadow-lg
            flex
            items-center
            justify-center
            gap-3

            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          `}
        >
          {loading ? (
            <>
              {/* SPINNER */}
              <div
                className="
                  w-5
                  h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              ></div>
              Signing In...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}

export default Login;
