"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Image from "next/image";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function User() {
  const { merchantToken, BASE_URL } = useApp();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users
  const fetchUser = async () => {
    if (!merchantToken) return;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users?limit=5&page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${merchantToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to fetch users");

      setUser(data?.data || []);
      console.log("Fetched users:", data);
    } catch (err) {
      toast.error(err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${merchantToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.msg || JSON.stringify(data) || "Failed to delete user"
        );
      }

      toast.success("User deleted successfully!");
      fetchUser();
    } catch (err) {
      toast.error(`Error deleting user: ${err.message}`);
    }
  };

  useEffect(() => {
    if (merchantToken) fetchUser();
  }, [merchantToken]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Merchant Users</h1>

        <Link
          href="/dashboard/merchant/user/create"
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          <FaPlus /> Create User
        </Link>
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
        </div>
      ) : user.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.map((u) => (
            <div
              key={u.id}
              className="bg-white shadow-md border border-gray-100 rounded-xl p-4 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/default-avatar.jpg"
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover border w-24 h-24 sm:w-32 sm:h-32"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {u.first_name} {u.last_name}
                  </h3>
                  <p className="text-gray-500 text-sm">{u.email}</p>
                  <p className="text-gray-400 text-xs">{u.phone}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <Link
                  href={`/dashboard/merchant/user/${u.id}/edit`}
                  className="text-green-500 hover:text-green-700 flex items-center gap-1"
                >
                  <FaEdit  /> Edit
                </Link>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No users found.</p>
      )}
    </div>
  );
}
