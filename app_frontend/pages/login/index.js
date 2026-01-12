// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getBaseUrl } from "@/baseURLS";
import Logo from "@/public/Logo.png"; // Adjust path if needed
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${getBaseUrl()}/api/token/`, {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const userResponse = await axios.get(`${getBaseUrl()}/api/auth/check`, {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(userResponse.data));
      window.dispatchEvent(new Event("authChange"));

      alert("Login successful!");

      router.push(redirect || "/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side with logo/image */}
      <div className="w-1/2 bg-[#F4EBD0] flex flex-col items-center justify-center">
        <Image src={Logo} alt="Logo" className="w-1/2 h-auto mb-6" />
        <h1 className="text-4xl font-bold text-[#6B8E23]">The Juiz Lab</h1>
      </div>

      {/* Right side with login box */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-96 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded p-2">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#6B8E23] text-white py-2 rounded hover:bg-[#557A1F] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
