"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";

export default function AgentProperties() {
  const { agentToken, agent, user, userToken, BASE_URL } = useApp();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch agent properties
  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const agentRes = await fetch(
        `${BASE_URL}/properties?agent=${agent.id}&verified=true`,
        {
          headers: { Authorization: `Bearer ${agentToken}` },
        }
      );
      const agentData = await agentRes.json();

      const userRes = await fetch(`${BASE_URL}/users/${user.id}/properties`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const userData = await userRes.json();

      const availableProperties = (agentData.data || []).map((p) => ({
        ...p,
        isBought: false,
        market_status: "AVAILABLE",
      }));

      const boughtProperties = (userData.data || []).map((p) => ({
        ...p,
        isBought: true,
        market_status: "BOUGHT",
      }));

      const combined = [...availableProperties, ...boughtProperties];
      setProperties(combined);
    } catch (error) {
      console.log("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (agentToken && userToken) fetchAllProperties();
  }, [agentToken, userToken]);

  // Delete property
  const deleteProperty = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${agentToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Property deleted successfully");
        fetchAllProperties();
      } else {
        toast.error(data?.msg || "Failed to delete property");
      }
    } catch {
      toast.error("Error deleting property");
    }
  };

  // Skeleton loader
  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-100 bg-white rounded-2xl shadow-sm animate-pulse"
        >
          <div className="w-full h-56 bg-gray-200 rounded-t-2xl"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-[#2b2340]">
          Agent Properties
        </h1>
        <Link
          href="/dashboard/agent/properties/create"
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-all duration-300"
        >
          <FaPlus /> Create
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <PropertyCard
                property={p}
                id={p.id}
                imageSrc={p.images?.[0] || "/placeholder.jpg"}
                title={p.name}
                location={`${p.city || ""}, ${p.state || ""}`}
                price={`₦${Number(p.price)?.toLocaleString()}`}
                bedrooms={p.bedroom || 0}
                bathrooms={p.bathroom || 0}
                area={p.total_area || "N/A"}
                isBought={p.market_status === "BOUGHT"}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  href={`/dashboard/agent/properties/${p.id}/edit`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FaEdit /> Edit
                </Link>

                <button
                  onClick={() => deleteProperty(p.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No properties found.</p>
      )}
    </div>
  );
}
