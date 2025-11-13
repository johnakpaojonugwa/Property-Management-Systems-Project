"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function CreateAgent() {
  const { merchantToken, BASE_URL, theme } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    password: "",
  });

  const isDark = theme === "dark";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!merchantToken) return toast.error("Please login first!");
    if (!form.full_name || !form.email || !form.password || !form.phone || !form.company)
      return toast.error("Full name, email, company, phone, and password are required!");

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/merchants/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${merchantToken}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to create agent");

      toast.success("Agent created successfully!");
      router.push("/dashboard/merchant/agents");
    } catch (err) {
      toast.error(err.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  // theme-aware class helpers
  const bgMain = isDark ? "bg-[#0f172a]" : "bg-gray-50";
  const titleColor = isDark ? "text-gray-100" : "text-gray-900";
  const linkColor = isDark ? "text-gray-300 hover:text-blue-300" : "text-gray-700 hover:text-blue-700";
  const cardBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100";
  const inputBg = isDark ? "bg-slate-900 text-gray-100" : "bg-white text-gray-900";
  const inputBorder = isDark ? "border-slate-700" : "border-gray-200";
  const btnBg = isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700";
  const iconBubble = isDark ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700";

  return (
    <div className={`min-h-screen ${bgMain} p-6 flex flex-col items-center transition-colors duration-200`}>
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <h1 className={`text-xl font-semibold ${titleColor} flex items-center gap-2`}>
          <div className={`p-3 rounded-full ${iconBubble}`}>
            <FaUserPlus />
          </div>
          <span>Create New Agent</span>
        </h1>

        <Link href="/dashboard/merchant/agents" className={`flex items-center gap-2 ${linkColor} transition`}>
          <FaArrowLeft /> <span>Back</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className={`w-full max-w-3xl ${cardBg} p-8 rounded-2xl shadow-md border transition-colors duration-200`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full rounded-lg px-4 py-2.5 border ${inputBorder} ${inputBg} focus:ring-2 focus:outline-none focus:ring-blue-500 transition`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Company
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className={`w-full rounded-lg px-4 py-2.5 border ${inputBorder} ${inputBg} focus:ring-2 focus:outline-none focus:ring-blue-500 transition`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full rounded-lg px-4 py-2.5 border ${inputBorder} ${inputBg} focus:ring-2 focus:outline-none focus:ring-blue-500 transition`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full rounded-lg px-4 py-2.5 border ${inputBorder} ${inputBg} focus:ring-2 focus:outline-none focus:ring-blue-500 transition`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full rounded-lg px-4 py-2.5 border ${inputBorder} ${inputBg} focus:ring-2 focus:outline-none focus:ring-blue-500 transition`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 text-white font-medium rounded-lg transition ${btnBg} disabled:opacity-70`}
          >
            {loading ? (
              <>
                <LiaSpinnerSolid className="animate-spin text-lg" /> Creating Agent...
              </>
            ) : (
              "Create Agent"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
