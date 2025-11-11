"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { MdOutlineTitle } from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { agentToken, BASE_URL } = useApp();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user details
  useEffect(() => {
    if (!id || !agentToken) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${agentToken}` },
        });
        const data = await res.json();
        if (res.ok) {
          setForm(data);
        } else {
          toast.error("Failed to load user data");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching user");
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [id, agentToken, BASE_URL]);

  //Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  //Edit user
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!agentToken) return toast.error("Missing agent token");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${agentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User updated successfully");
        router.push("/dashboard/agent/user");
      } else {
        toast.error(data?.msg || "Failed to update property");
      }
    } catch (err) {
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader (form)
  if (loadingUser) {
    return (
      <div className="w-full max-w-md mx-auto bg-white shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg p-8 mx-3">
      <h1 className="text-2xl font-semibold mb-6 text-[#2b2340">Update User</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div className="relative">
          <MdOutlineTitle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>
        <div className="relative">
          <MdOutlineTitle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-center text-white py-2 rounded-md transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-800 hover:bg-teal-600"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <LiaSpinnerSolid className="animate-spin text-lg" /> Updating...
            </span>
          ) : (
            "Update User"
          )}
        </button>
      </form>
    </div>
  );
}
