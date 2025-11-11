"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaUser,
  FaMagento, 
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

export default function MerchantLayout({ children }) {
  const pathname = usePathname();
  const { logout, merchant } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  console.log("Merchant info", merchant);

  // Merchant name
  const merchantId = merchant?.role || "Merchant";

  // Navigation items
  const navLinks = [
    {
      href: "/dashboard/merchant",
      label: "Overview",
      icon: <FaHome size={20} />,
    },
    {
      href: "/dashboard/merchant/agents",
      label: "Agents",
      icon: <FaMagento  size={20} />,
    },
    {
      href: "/dashboard/merchant/user",
      label: "Users",
      icon: <FaUsers size={20} />,
    },
    {
      href: "/dashboard/merchant/properties",
      label: "Properties",
      icon: <FaUsers size={20} />,
    },
    {
      href: "/dashboard/merchant/wishlist",
      label: "Wishlists",
      icon: <FaHeart size={20} />,
    },
    {
      href: "/dashboard/merchant/profile",
      label: "Profile",
      icon: <FaUser size={20} />,
    },
    {
      href: "/dashboard/merchant/settings",
      label: "Settings",
      icon: <FaCog size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-gray-100 flex-col justify-between">
        <div>
          <div className="text-center py-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold">🏠 {merchantId}</h1>
          </div>

          <nav className="mt-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-gray-800 transition ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-blue-500/20"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 mt-auto cursor-pointer px-4 py-3 rounded-md text-gray-300 hover:bg-red-600/20 hover:text-white transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/*Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-gray-100 z-50 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="text-center py-6 border-b border-gray-700 flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold">🏠 {merchantId}</h1>
            <button onClick={() => setMobileOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <nav className="mt-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-gray-800 transition ${
                  pathname === link.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="m-6 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 transition rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-4 md:p-6 shadow-md sticky top-0 z-30 bg-white">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileOpen(true)}
            >
              <FaBars size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>
          </div>

          {/* Greeting */}
          <div className="bg-gray-100 flex items-center rounded-full shadow px-4 py-2 text-sm text-gray-600">
            👋 Welcome back,&nbsp;
            <span className="font-medium text-gray-800">{merchantId}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
