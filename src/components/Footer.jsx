"use client";

import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-300 px-6 sm:px-10 md:px-16 lg:px-24 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">

        {/*Logo, Socials & Address */}
        <div>
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/BuyLetLive Logo.png"
              alt="BuyLetLive Logo"
              width={160}
              height={40}
              className="w-40 object-contain"
            />
          </div>

          {/* Socials */}
          <div className="flex space-x-5 text-lg mb-6">
            <a href="#" className="hover:text-teal-400 transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-teal-400 transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-teal-400 transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-teal-400 transition-colors"><FaLinkedinIn /></a>
          </div>

          {/* Addresses */}
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-semibold text-white mb-1">Lagos:</p>
              <p className="leading-relaxed">
                13, Otunba Adedoyin Ogungbe Crescent,<br />
                Lekki Phase 1, Lagos, Nigeria.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">London:</p>
              <p className="leading-relaxed">
                Kemp House, 160 City Road,<br />
                London, EC1V 2NX.
              </p>
            </div>
          </div>
        </div>

        {/*Links*/}
        <div className="md:col-span-1 lg:col-span-1">
          <div className="grid grid-cols-2 gap-x-6">
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Articles</a></li>
            </ul>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/*Newsletter */}
        <div className="lg:col-span-2 md:col-span-3">
          <h3 className="text-white font-semibold mb-3">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Stay updated with real-estate insights for Nigerians in the diaspora.
          </p>

          {/* Newsletter input + separate button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-md gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 bg-white text-gray-800 text-sm rounded-lg outline-none border border-gray-300 focus:border-[#3A2B66] focus:ring-1 focus:ring-[#3A2B66] transition"
            />
            <button className="bg-[#3A2B66] cursor-pointer hover:bg-teal-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg transition">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            We'll send 1-2 emails per month. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center border-t border-gray-800 pt-6 text-xs text-gray-500">
        © {new Date().getFullYear()} Clone: BuyLetLive. All rights reserved.
      </div>
    </footer>
  );
}
