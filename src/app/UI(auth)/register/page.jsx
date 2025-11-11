"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LiaSpinnerSolid } from "react-icons/lia";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";


export default function RegisterPage() {
  const { BASE_URL, agentToken } = useApp();
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agentToken) {
      toast.error("Please login first");
      return;
    }

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      toast.warn("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${agentToken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Merchant account created successfully!");
        router.push("/login");
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (err) {
      console.log("Registration error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 mx-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 underline text-sm text-gray-600 hover:text-blue-800 mb-4 cursor-pointer"
        >
          <IoArrowBack className="text-lg" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Enter your first name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:ring-1 focus:ring-blue-950 focus:outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Enter your last name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:ring-1 focus:ring-blue-950 focus:outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <MdOutlineAlternateEmail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:ring-1 focus:ring-blue-950 focus:outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:ring-1 focus:ring-blue-950 focus:outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <RiLockPasswordFill className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:ring-1 focus:ring-blue-950 focus:outline-none placeholder:text-gray-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium cursor-pointer transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-900"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LiaSpinnerSolid className="animate-spin text-lg" /> Creating...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link
            href="/UI(auth)/signin"
            className="text-blue-600 hover:underline font-medium"
          >
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
}
