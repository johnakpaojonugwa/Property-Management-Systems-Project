"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FaHome, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import axios from "axios";

/* Small skeleton components */
const PropertiesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="border border-gray-100 bg-white rounded-2xl shadow-sm animate-pulse"
      >
        <div className="w-full h-56 bg-gray-200 rounded-t-2xl" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const ReviewsSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-3 bg-gray-200 rounded animate-pulse h-16" />
    ))}
  </div>
);

export default function AgentDashboard() {
  const { agentToken, BASE_URL, agent, user, userToken } = useApp();
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");


  const filteredProperties = properties.filter((p) => {
  if (filter === "Bought") return p.isBought || p.market_status === "BOUGHT";
  if (filter === "Available") return !p.isBought && p.market_status !== "BOUGHT";
  return true;
});

  // separate loading states so we can show skeletons per-section
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingAppts, setLoadingAppts] = useState(false);
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

        // If nothing selected, default to first property's id (if present)
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

  // Fetch appointments
  useEffect(() => {
    if (!agentToken || !agent) return;

    const agentId = agent.profile?._id || agent.id;
    const fetchAppointments = async () => {
      setLoadingAppts(true);
      try {
        const res = await axios.get(`${BASE_URL}/appointments`, {
          params: { agent: agentId, completed: false, page: 0, limit: 10 },
          headers: { Authorization: `Bearer ${agentToken}` },
        });
        const apptData = res.data?.data || [];
        setAppointments(apptData);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoadingAppts(false);
      }
    };

    fetchAppointments();
  }, [agentToken, agent, BASE_URL]);

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

  // helpers
  const uniqueClientsCount = () => {
    if (!appointments || appointments.length === 0) return 0;
    // appointments may have user or user_id fields
    const ids = appointments
      .map((a) => a.user?.id || a.user?._id || a.user_id || a.userId)
      .filter(Boolean);
    return new Set(ids).size;
  };

  return (
    <div className="p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
          <FaHome className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Properties</p>
            <h3 className="text-xl font-semibold">{properties.length}</h3>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
          <FaCalendarAlt className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Appointments</p>
            <h3 className="text-xl font-semibold">{appointments.length}</h3>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
          <FaUsers className="text-orange-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Clients</p>
            <h3 className="text-xl font-semibold">{uniqueClientsCount()}</h3>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
          <FaStar className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Recent Reviews</p>
            <h3 className="text-xl font-semibold">{reviews.length}</h3>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Properties */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">My Properties</h2>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {["All", "Available", "Bought"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1 rounded-full text-sm font-medium border cursor-pointer transition-all ${
                    filter === type
                      ? "bg-blue-950 text-white border-blue-900"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loadingProps ? (
            <PropertiesSkeleton />
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProperties.map((p) => {
                const id = p.id || p._id;
                return (
                  <PropertyCard
                    property={p}
                    key={id}
                    id={id}
                    imageSrc={p.images?.[0] || "/placeholder.jpg"}
                    title={p.name || p.title}
                    location={[p.city, p.state].filter(Boolean).join(", ")}
                    price={
                      p.price ? `₦${Number(p.price).toLocaleString()}` : "N/A"
                    }
                    bedrooms={p.bedroom || 0}
                    bathrooms={p.bathroom || 0}
                    area={p.total_area || "N/A"}
                    isBought={p.market_status === "BOUGHT" || p.isBought}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No properties found.</p>
          )}
        </section>

        {/* Appointments */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            {loadingAppts ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-200 rounded animate-pulse h-16"
                  />
                ))}
              </div>
            ) : appointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {appointments.slice(0, 6).map((a) => {
                  const userName =
                    a.user?.full_name || a.user?.name || "Client";
                  const propertyName =
                    a.property?.name || a.property?.title || "Property";
                  return (
                    <li key={a.id || a._id} className="py-3">
                      <p className="font-medium">{userName}</p>
                      <p className="text-gray-500 text-sm">
                        {a.msg || `${propertyName}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(a.date).toLocaleDateString()} ({a.time?.from}{" "}
                        - {a.time?.to})
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No appointments yet.</p>
            )}
          </div>
        </section>

        {/* Reviews with property select */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Property Reviews</h2>
          </div>

          <div className="mb-4">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-2 focus:ring-blue-400"
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

          <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
            {loadingReviews ? (
              <ReviewsSkeleton />
            ) : reviews.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {reviews.map((r) => (
                  <li key={r.id || r._id} className="py-3">
                    <p className="font-medium">
                      {r.user?.full_name || r.reviewer_name || "Anonymous"}
                    </p>
                    <p className="text-gray-700">
                      {r.text || r.comment || "No comment"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      <strong>Date Created:</strong> {r.created_at ?? "N/A"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : selectedPropertyId ? (
              <p className="text-gray-500">No reviews for this property yet.</p>
            ) : (
              <p className="text-gray-500">
                Select a property to view its reviews.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
