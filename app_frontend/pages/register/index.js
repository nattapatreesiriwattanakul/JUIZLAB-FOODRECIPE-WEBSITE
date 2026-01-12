import { useState } from "react";
import { useRouter } from "next/router";
import { getBaseUrl } from "@/baseURLS";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = async (e) => {
    e.preventDefault();
    const formData = { username, email, password };
    console.log("Form data:", formData);

    try {
      const response = await fetch(`${getBaseUrl()}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Error from backend:", err);
        throw new Error(err.error || "Registration failed");
      }
      const data = await response.json();
      console.log("Response data:", data);
      alert("Registration success!");
      router.push("/login");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left visual section */}
      <div className="w-1/2 bg-[#F4EBD0] flex items-center justify-center">
        <h1 className="text-4xl font-bold text-[#6B8E23]">
          Join The Juiz Lab Community!
        </h1>
      </div>

      {/* Right form section */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={onRegister}
          className="bg-white p-8 rounded shadow-md w-96 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create Account
          </h2>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#6B8E23] text-white py-2 rounded hover:bg-[#557A1F] transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
