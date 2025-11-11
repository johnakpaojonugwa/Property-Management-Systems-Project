"use client";

import Image from "next/image";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import {
  FaBed,
  FaShower,
  FaRulerCombined,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";

export default function PropertyCard({
  id,
  imageSrc,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  isBought,
}) {
  const { BASE_URL, agentToken, agent } = useApp();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();

    if (!agent || !agentToken) {
      return toast.error("Please log in to save properties to your wishlist.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${agentToken}`,
        },
        body: JSON.stringify({
          property_id: id,
          user_id: agent?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to add to wishlist");

      setIsWishlisted(true);
      toast.success("Property added to wishlist!");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border border-gray-100 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1 cursor-pointer">
      <Link href={`/properties/${id}`}>
        {/* Image Section */}
        <div className="relative rounded-t-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            width={400}
            height={250}
            className="w-full h-56 object-cover"
          />

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            disabled={loading}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500" size={18} />
            ) : (
              <FaRegHeart className="text-gray-500" size={18} />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-[#2b2340] line-clamp-1 mb-2">
            {title}
          </h2>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <IoLocationOutline size={16} className="text-gray-500" />
            <p className="text-gray-400 text-sm truncate">{location}</p>
          </div>

          {/* Price */}
          <p className="text-lg font-bold mb-4 text-[#2b2340]">{price}</p>

          {/* Details + Status */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <div className="flex gap-4 items-center text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <FaBed className="text-blue-950" size={14} />
                <span className="text-xs">{bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaShower className="text-blue-950" size={14} />
                <span className="text-xs">{bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaRulerCombined className="text-blue-950" size={14} />
                <span className="text-xs">{area}</span>
              </div>
            </div>

            {/* Bought/Available Badge */}
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isBought
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {isBought ? "Bought" : "Available"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
