"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function CreateAgent() {
  const { merchantToken, BASE_URL } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!merchantToken) {
      toast.error("Please login first!");
      return;
    }

    if (!form.full_name || !form.email || !form.password || !form.phone || !form.company) {
      toast.error("Full name, email, company, phone, and password are required!");
      return;
    }

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
      console.log("Created Agent:", data);
      router.push("/dashboard/merchant/agents");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserPlus className="text-blue-600" /> Create Agent
        </h1>
        <Link
          href="/dashboard/merchant/agents"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter phone number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="Enter password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LiaSpinnerSolid className="animate-spin text-lg" /> Creating...
            </>
          ) : (
            <>
              Create Agent
            </>
          )}
        </button>
      </form>
    </div>
  );
}
