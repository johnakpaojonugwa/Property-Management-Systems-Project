"use client";

import Image from "next/image";

export default function Card({ icon, text, imageSrc, title, description }) {
  return (
    <div className="border border-gray-100 bg-[#f7f7f7] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-left hover:-translate-y-2">
      {/* Icon */}
      {icon && (
        <div className="flex justify-start mb-4 items-center text-[#2b2340] text-3xl">
          {icon}
        </div>
      )}

      {/* Optional Top Text */}
      {text && (
        <p className="text-md uppercase tracking-wide font-semibold mb-2 text-[#2b2340]">
          {text}
        </p>
      )}

      {/* Optional Image */}
      {imageSrc && (
        <div className="flex justify-start mb-4 items-center rounded-t-xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={title || "Card image"}
            width={300}
            height={500}
            className="w-full h-70 object-cover rounded-xl"
          />
        </div>
      )}

      {/* Title */}
      {title && (
        <h2 className="text-md font-bold text-[#232323] mb-3">{title}</h2>
      )}

      {/* Description */}
      {description && (
        <p className="text-[#666] text-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
}



<div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Left Card - Buying Properties With Others */}
  <div className="flex items-center bg-white shadow-md rounded-xl p-6 gap-4">
    <img
      src="/Buying Properties With Others.png"
      alt="Buying property with others"
      className="w-32 h-32 object-contain rounded-lg"
    />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Buying Properties With Others
      </h2>
      <ul className="space-y-1 text-gray-600 list-disc pl-5 marker:text-red-500">
        <li>Unverified listings</li>
        <li>Hidden fees</li>
        <li>Slow response times</li>
      </ul>
    </div>
  </div>

  {/* Right Card - Buying Properties With BuyLetLive */}
  <div className="flex items-center bg-white shadow-md rounded-xl p-6 gap-4">
    <img
      src="/Buying properties with BuyLetLive.png"
      alt="Buying property with BuyLetLive"
      className="w-32 h-32 object-contain rounded-lg"
    />
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Buying Properties With BuyLetLive
      </h2>
      <ul className="space-y-1 text-gray-600 list-disc pl-5 marker:text-green-500">
        <li>Verified listings</li>
        <li>Transparent pricing</li>
        <li>Dedicated support</li>
      </ul>
    </div>
  </div>
</div>
