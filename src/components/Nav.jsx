"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 overflow-hidden">
          <Image
            src="/BuyLetLive.png"
            alt="BuyLetLive Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-40 h-auto transform transition hover:scale-105"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-[#2b2340] font-medium">
          <Link href="/buy" className="hover:text-teal-500 transition text-[16px]">
            Buy
          </Link>
          <Link href="/mortgage" className="hover:text-teal-500 transition text-[16px]">
            Mortgage
          </Link>
          <Link href="/UI(auth)/signin" className="hover:text-teal-500 transition text-[16px]">
            Account
          </Link>
        </div>

        {/* CTA Button (Desktop only) */}
        <Link href="/appointments">
          <div className="hidden md:block">
          <button className="bg-[#2b2340] text-white px-5 py-2 rounded-full hover:bg-teal-500 transition cursor-pointer">
            Book Consultation
          </button>
        </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#2b2340] text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <ul className="flex flex-col px-6 py-4 space-y-4 text-[#3a2b66] font-medium">
            <li>
              <Link
                href="/buy"
                className="block hover:text-[#5e4b8b]"
                onClick={() => setMenuOpen(false)}
              >
                Buy
              </Link>
            </li>
            <li>
              <Link
                href="/mortgage"
                className="block hover:text-[#5e4b8b]"
                onClick={() => setMenuOpen(false)}
              >
                Mortgage
              </Link>
            </li>
            <li>
              <Link
                href="/UI(auth)/signin"
                className="block hover:text-[#5e4b8b]"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
            </li>

            <li className="pt-2 border-t border-gray-200">
              <button
                className="w-full bg-[#2b2340] text-white py-2 rounded-full hover:bg-[#3b2e58] transition"
                onClick={() => setMenuOpen(false)}
              >
                Book Consultation
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
