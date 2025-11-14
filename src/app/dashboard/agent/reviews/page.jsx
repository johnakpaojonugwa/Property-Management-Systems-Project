"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FaHome, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import axios from "axios";

export default function AgentDashboard() {
  const { agentToken, BASE_URL, agent, user, userToken, theme } = useApp();
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");

  const filteredProperties = properties.filter((p) => {
    if (filter === "Bought") return p.isBought || p.market_status === "BOUGHT";
    if (filter === "Available")
      return !p.isBought && p.market_status !== "BOUGHT";
    return true;
  });

  // separate loading states
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  // Fetch properties (agent + user) -> combined
  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoadingProps(true);
      try {
        // safe agent id extraction
        const agentId = agent?.id || agent?.profile?._id;
        const agentRes = await axios.get(`${BASE_URL}/properties`, {
          params: { agent: agentId, verified: true },
          headers: { Authorization: `Bearer ${agentToken}` },
        });
        const agentData = agentRes.data?.data || [];

        const userRes = await axios.get(
          `${BASE_URL}/users/${user?.id || user?._id}/properties`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const userData = userRes.data?.data || [];

        const availableProperties = agentData.map((p) => ({
          ...p,
          isBought: false,
          market_status: p.market_status || "AVAILABLE",
        }));
        const boughtProperties = userData.map((p) => ({
          ...p,
          isBought: true,
          market_status: p.market_status || "BOUGHT",
        }));

        const combined = [...availableProperties, ...boughtProperties];
        setProperties(combined);

        // If nothing selected, default to first property's id
        if (!selectedPropertyId && combined.length > 0) {
          const firstId = combined[0].id || combined[0]._id;
          setSelectedPropertyId(firstId);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        toast.error("Failed to fetch properties");
      } finally {
        setLoadingProps(false);
      }
    };

    if (agentToken && userToken) fetchAllProperties();
  }, [agentToken, userToken, agent, BASE_URL]);

  // Fetch reviews when selectedPropertyId changes
  useEffect(() => {
    if (!agentToken || !selectedPropertyId) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await axios.get(`${BASE_URL}/reviews`, {
          params: { property_id: selectedPropertyId, limit: 10, page: 0 },
          headers: { Authorization: `Bearer ${agentToken}` },
        });
        const data = res.data?.data || [];
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        toast.error("Failed to fetch reviews");
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [selectedPropertyId, agentToken, BASE_URL]);

  const ReviewsSkeleton = () => (
    <div className="space-y-3">
      {[...Array(1)].map((_, i) => (
        <div key={i} className="p-3 bg-gray-200 rounded animate-pulse h-16" />
      ))}
    </div>
  );

  return (
    <div
      className={`p-6 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Main content */}
      <div className="space-y-8">
        {/* Reviews with property select */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold">Property Reviews</h2>
          </div>

          <div className="mb-4">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className={`border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-2 focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-vlue-400"
              }`}
            >
              <option value="">Select a property</option>
              {properties.map((p) => {
                const id = p.id || p._id;
                return (
                  <option key={id} value={id}>
                    {p.name || p.title || `Property ${id.slice(0, 6)}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="rounded-lg shadow p-4 min-h-[120px]">
            {loadingReviews ? (
              <ReviewsSkeleton />
            ) : reviews.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {reviews.map((r) => (
                  <li key={r.id || r._id} className="py-3">
                    <p className="font-medium">
                      {r.user?.full_name || r.reviewer_name || "Anonymous"}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {r.text || r.comment || "No comment"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      <strong>Date Created:</strong> {r.created_at ?? "N/A"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : selectedPropertyId ? (
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No reviews for this property yet.
              </p>
            ) : (
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Select a property to view its reviews.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
