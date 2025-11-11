"use client";

import { FaStar, FaUsers, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full mb-5 min-h-[100vh] md:h-[90vh] flex items-center justify-center bg-cover bg-center pb-10 pt-20 md:pt-24"
      style={{
        backgroundImage: "url('/hero-bg.png')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-white w-[90%] max-w-6xl mx-auto text-center md:text-left"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-tight mb-4"
        >
          Secure Your Next <br className="hidden sm:block" /> Home in Nigeria{" "}
          <br className="hidden sm:block" /> With Confidence
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto md:mx-0 mb-8"
        >
          We make it easy to find, vet, and secure properties in Nigeria with
          support you can count on.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center md:justify-start gap-4 mb-6"
        >
          <a href="#listings">
            <button className="bg-[#3A2B66] hover:bg-teal-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition cursor-pointer text-sm sm:text-base shadow-md">
              Browse Listings
            </button>
          </a>
          <Link href="/appointments">
            <button className="border border-white hover:bg-[#3A2B66] hover:text-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition cursor-pointer text-sm sm:text-base shadow-md">
            Request for a Property
          </button>
          </Link>
        </motion.div>

        {/* Floating Card (Now below buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="mx-auto md:mx-0 bg-white/80 backdrop-blur-md rounded-xl shadow-xl 
                     flex flex-col sm:flex-row items-center justify-center md:justify-between 
                     gap-4 sm:gap-6 px-4 sm:px-6 py-4 text-gray-800 w-full sm:w-auto md:inline-flex lg:absolute lg:right-0 lg:bottom-0 xl:right-10 xl:bottom-10"
        >
          {/* Rating */}
          <div className="flex items-center gap-2 sm:gap-3 border-b sm:border-b-0 sm:border-r sm:pr-6 border-gray-300">
            <FaStar className="text-yellow-500 text-lg sm:text-xl" />
            <div className="text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg">4.9/5</p>
              <p className="text-xs sm:text-sm text-gray-600">
                Platform Ratings
              </p>
            </div>
          </div>

          {/* Clients Served */}
          <div className="flex items-center gap-2 sm:gap-3 border-b sm:border-b-0 sm:border-r sm:pr-6 border-gray-300">
            <FaUsers className="text-[#3A2B66] text-lg sm:text-xl" />
            <div className="text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg">200+</p>
              <p className="text-xs sm:text-sm text-gray-600">Clients Served</p>
            </div>
          </div>

          {/* Partner Banks */}
          <div className="flex items-center gap-2 sm:gap-3">
            <FaBuilding className="text-[#3A2B66] text-lg sm:text-xl" />
            <div className="text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg">15+</p>
              <p className="text-xs sm:text-sm text-gray-600">Partner Banks</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
