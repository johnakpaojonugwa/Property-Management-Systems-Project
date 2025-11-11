"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaHome,
  FaCalendarAlt,
  FaUserCog,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdRealEstateAgent, MdReviews } from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function AgentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { agent, agentToken, logout, loadingAgent } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);  

  // Redirect if user is not an agent
  useEffect(() => {
    if (!loadingAgent) {
      if (!agentToken) router.push("/login");
      else if (agent && agent.role !== "AGENT") router.push("/unauthorized");
    }
  }, [agentToken, agent]);

  if (loadingAgent || !agent)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

  // Agent display name or fallback
  const agentName = agent?.role
    ? agent.role
    : agent?.role
    ? `${agent.role}`
    : "Agent";

  // Navigation items
  const navLinks = [
    {
      href: "/dashboard/agent",
      label: "Dashboard",
      icon: <FaTachometerAlt size={20} />,
    },
    {
      href: "/dashboard/agent/properties",
      label: "My Properties",
      icon: <FaHome size={20} />,
    },
    {
      href: "/dashboard/agent/user",
      label: "Users",
      icon: <FaUser size={20} />,
    },
    {
      href: "/dashboard/agent/appointments",
      label: "Appointments",
      icon: <FaCalendarAlt size={20} />,
    },
    {
      href: "/dashboard/agent/reviews",
      label: "Reviews",
      icon: <MdReviews  size={20} />,
    },
    {
      href: "/dashboard/agent/profile",
      label: "Profile",
      icon: <FaUserCog size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-gray-100 flex-col justify-between">
        <div>
          <div className="text-center py-6 border-b border-gray-700 flex items-center justify-center gap-2">
            <MdRealEstateAgent size={24} />
            <h1 className="text-2xl font-bold">Agent</h1>
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
          onClick={handleLogout}
          className="flex items-center gap-2 mt-auto cursor-pointer px-4 py-3 rounded-md text-gray-300 hover:bg-red-600/20 hover:text-white transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Mobile Overlay*/}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar*/}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-gray-100 z-50 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="text-center py-6 border-b border-gray-700 flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MdRealEstateAgent /> Agent
            </h1>
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
          onClick={handleLogout}
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
            <span className="font-medium text-gray-800">{agentName}</span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
