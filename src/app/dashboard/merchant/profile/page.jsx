"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaUser, FaCalendarAlt } from "react-icons/fa";

export default function MerchantProfile() {
  const { merchant, merchantToken, theme } = useApp();
  const router = useRouter();

  console.log("AppContext merchant:", merchant);

  useEffect(() => {
    if (!merchantToken) {
      toast.error("Please login first!");
      router.push("/login");
    }
  }, [merchantToken, router]);

  const merchantData = merchant?.merchant || merchant?.user || merchant;

  if (!merchantData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
        <p>Merchant profile not found.</p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 transition-all duration-300 ${
        theme === "dark"
          ? "bg-[#0b0b0f] text-gray-200"
          : "bg-slate-100 text-gray-800"
      }`}
    >
      {/* Merchant Card */}
      <div
        className={`rounded-2xl p-6 max-w-6xl mx-auto mb-8 shadow-md border transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#151521] border-[#2a2a3b]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src="/default-avatar2.jpg"
            alt="Merchant Avatar"
            className="w-28 h-28 rounded-full border object-cover"
          />

          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              {merchantData?.profile?.full_name || "Merchant"}
            </h2>
            <p className="flex items-center gap-2 text-gray-600">
              <FaEnvelope className="text-blue-500" />
              {merchantData?.profile?.email || "admin@gmail.com"}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-blue-500" />
              Joined:{" "}
              {merchantData?.profile?.created_at
                ? new Date(merchant.created_at).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-gray-500">
          <p>
            Merchant ID:{" "}
            <span className="font-medium text-gray-700">
              {merchantData.id || "N/A"}
            </span>
          </p>
          <p>
            Status:{" "}
            <span
              className={`font-semibold ${
                merchantData?.profile?.is_verified
                  ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
              }`}
            >
              {merchant.is_verified ? "Verified" : "Pending Verification"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
