"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { MdRealEstateAgent } from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function UserLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userToken, logout, loadingUser, theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect if user is not a regular user
  useEffect(() => {
    if (!loadingUser) {
      if (!userToken) router.push("/login");
      else if (user && user.role !== "USER") router.push("/unauthorized");
    }
  }, [userToken, user]);

  if (loadingUser || !user)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

  const userName = user?.full_name
    ? user.full_name
    : user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : "User";

  const navLinks = [
    {
      href: "/dashboard/user",
      label: "Dashboard",
      icon: <FaTachometerAlt size={20} />,
    },
    {
      href: "/dashboard/user/properties",
      label: "My Properties",
      icon: <FaHome size={20} />,
    },
    {
      href: "/dashboard/user/wishlists",
      label: "Wishlists",
      icon: <IoMdHeart size={20} />,
    },
    {
      href: "/dashboard/user/appointments",
      label: "Appointments",
      icon: <FaCalendarAlt size={20} />,
    },
    {
      href: "/dashboard/user/profile",
      label: "Profile",
      icon: <FaUser size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Sidebar classes
  const sidebarBg =
    theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800";
  const sidebarLinkActive = "bg-blue-600 text-white";
  const sidebarLinkInactive =
    theme === "dark"
      ? "text-gray-300 hover:bg-gray-700"
      : "text-gray-700 hover:bg-blue-100";

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-100 text-gray-900"
      } flex min-h-screen transition-colors duration-300`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex w-64 flex-col justify-between p-4 shadow-lg sticky  ${sidebarBg}`}
      >
        <div>
          <div className="text-center p-2 flex flex-row items-center gap-2">
            <MdRealEstateAgent size={32} />
            <h1 className="text-center text-2xl font-bold">User</h1>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  pathname === link.href
                    ? sidebarLinkActive
                    : sidebarLinkInactive
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
          className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform md:hidden flex flex-col justify-between p-4 rounded-r-xl shadow-lg ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-white text-gray-800"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MdRealEstateAgent /> User
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
                  pathname === link.href
                    ? sidebarLinkActive
                    : sidebarLinkInactive
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
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <FaBars size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>
          </div>

          {/* Right section: greeting + theme toggle */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center rounded-full shadow px-4 py-2 text-sm ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              👋 Welcome back,{" "}
              <span className="font-medium ml-1">{userName}</span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 md:p-8">
          <div
            className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-900 text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import { useApp } from "@/context/AppContext";
// import { useEffect, useState } from "react";
// import {
//   FaTachometerAlt,
//   FaHome,
//   FaCalendarAlt,
//   FaUser,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { IoMdHeart } from "react-icons/io";
// import { MdRealEstateAgent } from "react-icons/md";

// export default function UserLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, userToken, logout, loadingUser } = useApp();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Redirect if user is not a regular user
//   useEffect(() => {
//     if (!loadingUser) {
//       if (!userToken) router.push("/login");
//       else if (user && user.role !== "USER") router.push("/unauthorized");
//     }
//   }, [userToken, user]);

//   if (loadingUser || !user)
//     return (
//       <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
//         Loading...
//       </div>
//     );

//   // Compute user's display name
//   const userName =
//     user?.full_name
//       ? user.full_name
//       : user?.first_name
//       ? `${user.first_name} ${user.last_name || ""}`
//       : "User";

//   // Navigation items
//   const navLinks = [
//     {
//       href: "/dashboard/user",
//       label: "Dashboard",
//       icon: <FaTachometerAlt size={20} />,
//     },
//     {
//       href: "/dashboard/user/properties",
//       label: "My Properties",
//       icon: <FaHome size={20} />,
//     },
//     {
//       href: "/dashboard/user/wishlists",
//       label: "Wishlists",
//       icon: <IoMdHeart size={20} />,
//     },
//     {
//       href: "/dashboard/user/appointments",
//       label: "Appointments",
//       icon: <FaCalendarAlt size={20} />,
//     },
//     {
//       href: "/dashboard/user/profile",
//       label: "Profile",
//       icon: <FaUser size={20} />,
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* ===== Desktop Sidebar ===== */}
//       <aside className="hidden md:flex w-64 bg-[#0f172a] text-gray-100 flex-col justify-between">
//         <div>
//           <div className="text-center py-6 border-b border-gray-700 flex items-center justify-center gap-2">
//             <MdRealEstateAgent size={24} />
//             <h1 className="text-2xl font-bold">User</h1>
//           </div>

//           <nav className="mt-6 space-y-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={`flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-gray-800 transition ${
//                   pathname === link.href
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-300 hover:bg-blue-500/20"
//                 }`}
//               >
//                 {link.icon}
//                 {link.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 mt-auto cursor-pointer px-4 py-3 rounded-md text-gray-300 hover:bg-red-600/20 hover:text-white transition-all"
//         >
//           <FaSignOutAlt /> Logout
//         </button>
//       </aside>

//       {/* ===== Mobile Overlay ===== */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
//           mobileOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setMobileOpen(false)}
//       />

//       {/* ===== Mobile Sidebar ===== */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-gray-100 z-50 transform transition-transform md:hidden ${
//           mobileOpen ? "translate-x-0" : "-translate-x-full"
//         } flex flex-col justify-between`}
//       >
//         <div>
//           <div className="text-center py-6 border-b border-gray-700 flex justify-between items-center px-6">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <MdRealEstateAgent /> User
//             </h1>
//             <button onClick={() => setMobileOpen(false)}>
//               <FaTimes />
//             </button>
//           </div>

//           <nav className="mt-6 space-y-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setMobileOpen(false)}
//                 className={`flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-gray-800 transition ${
//                   pathname === link.href
//                     ? "bg-gray-800 text-white"
//                     : "text-gray-300"
//                 }`}
//               >
//                 {link.icon}
//                 {link.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="m-6 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 transition rounded-md"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* ===== Main Content ===== */}
//       <main className="flex-1 overflow-y-auto">
//         {/* Header */}
//         <header className="flex justify-between items-center p-4 md:p-6 shadow-md sticky top-0 z-30 bg-white">
//           <div className="flex items-center gap-4">
//             {/* Mobile hamburger */}
//             <button
//               className="md:hidden text-gray-700"
//               onClick={() => setMobileOpen(true)}
//             >
//               <FaBars size={24} />
//             </button>
//             <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>
//           </div>

//           {/* Greeting */}
//           <div className="bg-gray-100 flex items-center rounded-full shadow px-4 py-2 text-sm text-gray-600">
//             👋 Welcome back,&nbsp;
//             <span className="font-medium text-gray-800">{userName}</span>
//           </div>
//         </header>

//         {/* Page content */}
//         <div className="p-4 md:p-6">{children}</div>
//       </main>
//     </div>
//   );
// }
