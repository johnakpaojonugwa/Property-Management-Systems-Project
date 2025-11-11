// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import { useApp } from "@/context/AppContext";
// import { useEffect } from "react";
// import {
//   FaTachometerAlt,
//   FaHome,
//   FaCalendarAlt,
//   FaUser,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { MdRealEstateAgent } from "react-icons/md";
// import { IoMdHeart  } from "react-icons/io";


// export default function UserLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, userToken, logout, loadingUser } = useApp();

//   // Redirect if user is not an agent
//   useEffect(() => {
//     if (!loadingUser) {
//       if (!userToken) router.push("/login");
//       else if (user && user.role !== "USER") router.push("/unauthorized");
//     }
//   }, [userToken, user]);

//   if (loadingUser || !user)
//     return <p className="p-6 text-center">Loading...</p>;

//   const navItems = [
//     {
//       name: "Dashboard",
//       href: "/dashboard/user",
//       icon: <FaTachometerAlt size={24} />,
//     },
//     {
//       name: "My Properties",
//       href: "/dashboard/user/properties",
//       icon: <FaHome size={24} />,
//     },
//     {
//       name: "Wishlists",
//       href: "/dashboard/user/wishlists",
//       icon: <IoMdHeart   size={24} />,
//     },
//     {
//       name: "Appointments",
//       href: "/dashboard/user/appointments",
//       icon: <FaCalendarAlt size={24} />,
//     },
//     {
//       name: "Profile",
//       href: "/dashboard/user/profile",
//       icon: <FaUser size={24} />,
//     },
//   ];

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] text-white py-6 px-4">
//         <div className="text-center mb-10 flex items-center border-b border-gray-700 pb-4 justify-center gap-2">
//           <MdRealEstateAgent size={24} />
//           <h2 className="text-xl font-bold">User</h2>
//         </div>

//         <nav className="flex-1 space-y-2">
//           {navItems.map((item) => {
//             const active = pathname === item.href;
//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`flex flex-col items-center text-xs py-1 ${
//                   active
//                     ? "text-blue-600 font-semibold border-l-2 border-blue-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {item.icon}
//                 <span>{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 mt-auto px-4 py-3 rounded-md text-gray-300 hover:bg-red-600/20 hover:text-white transition-all"
//         >
//           <FaSignOutAlt /> Logout
//         </button>
//       </aside>

//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 shadow-sm z-50">
//         {navItems.map((item) => {
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex flex-col items-center text-xs ${
//                 active ? "text-blue-600" : "text-gray-500"
//               }`}
//             >
//               {item.icon}
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </div>

//       <main className="flex-1 p-6">{children}</main>
//     </div>
//   );
// }



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

export default function UserLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userToken, logout, loadingUser } = useApp();
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
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        Loading...
      </div>
    );

  // Compute user's display name
  const userName =
    user?.full_name
      ? user.full_name
      : user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`
      : "User";

  // Navigation items
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-gray-100 flex-col justify-between">
        <div>
          <div className="text-center py-6 border-b border-gray-700 flex items-center justify-center gap-2">
            <MdRealEstateAgent size={24} />
            <h1 className="text-2xl font-bold">User</h1>
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

      {/* ===== Mobile Overlay ===== */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ===== Mobile Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-gray-100 z-50 transform transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="text-center py-6 border-b border-gray-700 flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MdRealEstateAgent /> User
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

      {/* ===== Main Content ===== */}
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
            <span className="font-medium text-gray-800">{userName}</span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
