"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaUser,
  FaMagento,
  FaBars,
  FaTimes,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function MerchantLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, merchant, merchantToken, theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect if not merchant
  useEffect(() => {
    if (!merchantToken) router.push("/login");
    else if (merchant && merchant.role !== "MERCHANT")
      router.push("/unauthorized");
  }, [merchantToken, merchant]);

  if (!merchant)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

  const merchantName = merchant?.full_name || merchant?.name || "Merchant";

  const navLinks = [
    { href: "/dashboard/merchant", label: "Overview", icon: <FaHome size={20} /> },
    { href: "/dashboard/merchant/agents", label: "Agents", icon: <FaMagento size={20} /> },
    { href: "/dashboard/merchant/user", label: "Users", icon: <FaUsers size={20} /> },
    { href: "/dashboard/merchant/properties", label: "Properties", icon: <FaHome size={20} /> },
    { href: "/dashboard/merchant/wishlist", label: "Wishlists", icon: <FaHeart size={20} /> },
    { href: "/dashboard/merchant/profile", label: "Profile", icon: <FaUser size={20} /> },
    { href: "/dashboard/merchant/settings", label: "Settings", icon: <FaCog size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const sidebarBg =
    theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800";
  const sidebarLinkActive = "bg-blue-600 text-white";
  const sidebarLinkInactive =
    theme === "dark"
      ? "text-gray-300 hover:bg-gray-700"
      : "text-gray-700 hover:bg-blue-100";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-64 flex-col justify-between p-4 shadow-lg sticky ${sidebarBg}`}>
        <div>
          <div className="text-center p-2 flex items-center gap-2">
            <MdAdminPanelSettings size={32} />
            <h1 className="text-2xl font-bold">{merchantName}</h1>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  pathname === link.href ? sidebarLinkActive : sidebarLinkInactive
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors mt-4"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform md:hidden flex flex-col justify-between p-4 rounded-r-xl shadow-lg ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MdAdminPanelSettings /> {merchantName}
            </h1>
            <button onClick={() => setMobileOpen(false)}>
              <FaTimes size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  pathname === link.href ? sidebarLinkActive : sidebarLinkInactive
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors mt-4"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header
          className={`flex justify-between items-center p-4 md:p-6 shadow-md sticky top-0 z-30 backdrop-blur-sm transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <FaBars size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`flex items-center rounded-full shadow px-4 py-2 text-sm ${
                theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
              }`}
            >
              👋 Welcome back, <span className="font-medium ml-1">{merchantName}</span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${
                theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          <div
            className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
