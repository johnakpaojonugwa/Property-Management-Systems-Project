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
} from "react-icons/fa";
import {
  MdRealEstateAgent,
  MdReviews,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from "react-toastify";

export default function AgentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    agent,
    agentToken,
    logout,
    theme,
    toggleTheme,
    merchantToken,
    BASE_URL,
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(agent);

  useEffect(() => {
    if (!merchantToken) {
      toast.error("Please login first!");
      return;
    }

    //Get Agent Details
    const fetchAgents = async () => {
      try {
        setLoading(true);
        let foundAgent = null;
        let page = 0;
        const limit = 5;
        let morePages = true;

        while (morePages && !foundAgent) {
          const res = await fetch(
            `${BASE_URL}/merchants/agents?offset=${
              page * limit
            }&limit=${limit}`,
            {
              headers: { Authorization: `Bearer ${merchantToken}` },
            }
          );

          const data = await res.json();
          if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

          foundAgent = data?.data?.find((a) => a.id === agent.id);
          morePages = data?.data?.length === limit;
          page++;
        }

        if (!foundAgent) throw new Error("Agent not found");
        setAgentData(foundAgent);
        console.log("AgentData:", foundAgent);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [merchantToken, BASE_URL]);

  const isDark = theme === "dark";

  useEffect(() => {
    if (agentToken === "") {
      router.push("/login");
      return;
    }

    if (agent && agent.role !== "AGENT") {
      router.push("/unauthorized");
      return;
    }

    // simulate load delay for smooth transition
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [agentToken, agent]);

  //Close dropdown when sidebar collapses
  useEffect(() => {
    if (collapsed) setDropdownOpen(false);
  }, [collapsed]);

  if (loading || !agent)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

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
      icon: <MdReviews size={20} />,
    },
    {
      href: "/dashboard/agent/profile",
      label: "Profile",
      icon: <FaUserCog size={20} />,
    },
  ];

  const currentPage =
    navLinks.find((link) => pathname === link.href)?.label || "Dashboard";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // No agent found
  if (!agentData) {
    return (
      <div className="p-8 text-center text-gray-500">
        No agent information found. Please log in again.
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        isDark ? "bg-[#0d1117] text-gray-100" : "bg-slate-100 text-slate-800"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed flex top-0 left-0 h-screen z-50 flex-col justify-between shaddow-sm transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${
          isDark
            ? "bg-[#10151d] border-r border-r-gray-800"
            : "bg-white border-r border-gray-200"
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="flex items-center py-5 px-4 border-b border-gray-200/50 gap-2">
            <MdRealEstateAgent size={26} className="text-blue-600" />
            {!collapsed && <h1 className="text-2xl font-bold">Agent</h1>}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col mt-4 space-y-1 px-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 truncate ${
                    active
                      ? "bg-blue-100 text-blue-600"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {link.icon}
                  {!collapsed && link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            <FaSignOutAlt size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b shadow-sm transition-all duration-300 ${
            collapsed ? "pl-20" : "pl-64"
          } ${
            isDark
              ? "bg-gray-900/90 border-gray-700"
              : "bg-white/80 backdrop-blur-md border-gray-200"
          }`}
        >
          {/* Hamburger */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-md transition ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <FaBars
              size={18}
              className={isDark ? "text-gray-100" : "text-gray-800"}
            />
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`transition rounded-full p-2 ${
                isDark
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 rounded-md p-1 transition ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {agentData?.full_name?.charAt(0)?.toUpperCase()}
                </div>

                {!collapsed && (
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium truncate">
                      {agentData?.full_name || "Agent"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {agentData?.email || "agent@gmail.com"}
                    </p>
                  </div>
                )}
              </button>
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-48 border shadow-lg rounded-lg overflow-hidden z-60 ${
                    isDark
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <Link
                    href="/dashboard/agent/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-800"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Section */}
        <section className="mt-20 p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <FaHome
              size={14}
              className={isDark ? "text-gray-400" : "text-gray-600"}
            />
            <MdOutlineKeyboardArrowRight size={14} />
            <h2 className="font-semibold text-sm">{currentPage}</h2>
          </div>

          {/* Page content */}
          <div className="p-4 md:p-6">{children}</div>
        </section>
      </main>
    </div>
  );
}
