"use client";

import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { LiaSpinnerSolid } from "react-icons/lia";
import Link from "next/link";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";

export default function Signin() {
  const { login, loading } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Update input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const success = await login(
        form.email.trim(),
        form.password.trim(),
        rememberMe
      );
      console.log("Signin success:", success);
      if (success) {
        router.push("/home");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.log("login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-lg bg-white shadow-lg p-8 mx-3 rounded-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 underline text-sm text-gray-600 hover:text-blue-800 mb-4 cursor-pointer"
        >
          <IoArrowBack className="text-lg" />
          Back
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-400 overflow-hidden focus-within:ring-1 focus-within:ring-amber-900">
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full py-2 px-3 text-gray-700 focus:outline-none"
              />
              <div className="border-l border-gray-300 px-3 py-2 bg-gray-50">
                <MdOutlineEmail className="text-gray-400 text-lg" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-400 overflow-hidden focus-within:ring-1 focus-within:ring-amber-900">
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full py-2 px-3 text-gray-700 focus:outline-none"
              />
              <div className="border-l border-gray-300 px-3 py-2 bg-gray-50">
                <RiLockPasswordFill className="text-gray-400 text-lg" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-400"
              />
              Remember me
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 text-white font-medium cursor-pointer transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-950 hover:bg-blue-900"
              }`}
            >
              {loading ? (
                <>
                  <LiaSpinnerSolid className="animate-spin text-lg" /> Signing
                  in...
                </>
              ) : (
                <>
                  <FiLogIn className="text-lg" /> Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link
            href="/UI(auth)/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
