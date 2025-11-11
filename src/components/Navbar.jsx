"use client";
import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { logoutUser, user } = useApp();
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-white shadow-md">
      <h1 className="text-xl font-semibold text-blue-700">🏡 PropertyManager</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 text-sm">
            Hello, <strong>{user.full_name || "Merchant"}</strong>
          </span>
        )}
        <button
          onClick={() => {
            logoutUser();
            router.push("/login");
          }}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
