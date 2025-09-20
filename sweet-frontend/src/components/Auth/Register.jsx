import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../redux/features/auth/authSlice";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
     if (token && window.location.pathname !== "/dashboard")  {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const validateForm = () => {
    if (!username.trim()) {
      setLocalError("Username is required");
      return false;
    }
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Enter a valid email address");
      return false;
    }
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Register the user
      const res = await dispatch(registerUser({ username, email, password })).unwrap();

      // Automatically login after successful registration
      const loginRes = await dispatch(loginUser({ email, password })).unwrap();

      // Store token in localStorage
      localStorage.setItem("token", loginRes.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Register
        </h2>
        {(localError || error) && (
          <p className="mb-4 text-red-600 font-semibold text-center">
            {localError || error}
          </p>
        )}

        <label className="block text-gray-700 font-semibold mb-2">Username</label>
        <input
          type="text"
          required
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <label className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <label className="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          required
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
        <input
          type="password"
          required
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          className="mt-4 text-center text-green-700 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
