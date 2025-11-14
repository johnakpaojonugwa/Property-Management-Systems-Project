"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FaHome, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import axios from "axios";

export default function AgentDashboard() {
  const { agentToken, BASE_URL, agent, user, userToken, theme, merchantToken } = useApp();
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const filteredProperties = properties.filter((p) => {
    if (filter === "Bought") return p.isBought || p.market_status === "BOUGHT";
    if (filter === "Available") return !p.isBought && p.market_status !== "BOUGHT";
    return true;
  });

  // Fetch properties
  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoadingProps(true);
      try {
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

        if (!selectedPropertyId && combined.length > 0) {
          const firstId = combined[0].id || combined[0]._id;
          setSelectedPropertyId(firstId);
        }
      } catch (err) {
        console.log("Error fetching properties:", err);
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
        setAppointments(res.data?.data || []);
      } catch (err) {
        console.log("Failed to fetch appointments:", err);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoadingAppts(false);
      }
    };

    fetchAppointments();
  }, [agentToken, agent, BASE_URL]);

  // Fetch reviews
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
        setReviews(res.data?.data || []);
      } catch (err) {
        console.log("Failed to fetch reviews:", err);
        toast.error("Failed to fetch reviews");
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [selectedPropertyId, agentToken, BASE_URL]);

  const uniqueClientsCount = () => {
    if (!appointments || appointments.length === 0) return 0;
    const ids = appointments
      .map((a) => a.user?.id || a.user?._id || a.user_id || a.userId)
      .filter(Boolean);
    return new Set(ids).size;
  };

  const PropertiesSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`border rounded-2xl shadow-sm animate-pulse ${
            theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
          }`}
        >
          <div className="w-full h-56 bg-gray-200 rounded-t-2xl dark:bg-gray-600" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-600" />
            <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-600" />
            <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );

  const ReviewsSkeleton = () => (
    <div className="space-y-3">
      {[...Array(1)].map((_, i) => (
        <div
          key={i}
          className={`p-3 rounded animate-pulse h-16 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );

  const cards = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: <FaHome size={24} />,
      color: "bg-purple-100 text-purple-500",
    },
    {
      title: "Appointments",
      value: appointments.length,
      icon: <FaCalendarAlt size={24} />,
      color: "bg-blue-100 text-blue-500",
    },
    {
      title: "Clients",
      value: uniqueClientsCount(),
      icon: <FaUsers size={24} />,
      color: "bg-green-100 text-green-500",
    },
    {
      title: "Recent Reviews",
      value: reviews.length,
      icon: <FaStar size={24} />,
      color: "bg-red-100 text-red-500",
    },
  ];

  return (
    <div
      className={`p-6 md:p-8 space-y-8 min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        Dashboard Overview
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((c) => (
          <DashboardCard key={c.title} {...c} theme={theme} />
        ))}
      </div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Properties */}
        <section>
          <div className="md:flex inline-block items-center md:justify-between mb-3 ">
            <h2 className="text-xl font-bold">My Properties</h2>
            <div className="flex gap-2">
              {["All", "Available", "Bought"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1 rounded-full text-sm font-medium border cursor-pointer transition-all ${
                    filter === type
                      ? theme === "dark"
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-blue-950 text-white border-blue-900"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
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
                    price={p.price ? `₦${Number(p.price).toLocaleString()}` : "N/A"}
                    bedrooms={p.bedroom || 0}
                    bathrooms={p.bathroom || 0}
                    area={p.total_area || "N/A"}
                    isBought={p.market_status === "BOUGHT" || p.isBought}
                    theme={theme}
                  />
                );
              })}
            </div>
          ) : (
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              No properties found.
            </p>
          )}
        </section>

        {/* Appointments + Reviews */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <div
              className={`rounded-2xl shadow p-5 transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Recent Appointments</h2>
              </div>

              {loadingAppts ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded animate-pulse h-16 ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {appointments.slice(0, 6).map((a) => {
                    const userName = a.user?.full_name || a.user?.name || "Client";
                    const propertyName = a.property?.name || a.property?.title || "Property";
                    return (
                      <li key={a.id || a._id} className="py-3">
                        <p className="font-medium">{userName}</p>
                        <p className="text-gray-500 text-sm">{a.msg || propertyName}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(a.date).toLocaleDateString()} ({a.time?.from} - {a.time?.to})
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  No appointments yet.
                </p>
              )}
            </div>

            {/* Property Reviews */}
            <div
              className={`rounded-2xl shadow p-5 transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Property Reviews</h2>
              </div>

              <div className="mb-4">
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className={`border rounded-lg p-2 w-full max-w-sm focus:ring-2 transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-400"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
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

              <div className="min-h-[120px]">
                {loadingReviews ? (
                  <ReviewsSkeleton />
                ) : reviews.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {reviews.map((r) => (
                      <li key={r.id || r._id} className="py-3">
                        <p className="font-medium">
                          {r.user?.full_name || r.reviewer_name || "Anonymous"}
                        </p>
                        <p className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                          {r.text || r.comment || "No comment"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          <strong>Date Created:</strong> {r.created_at ?? "N/A"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : selectedPropertyId ? (
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    No reviews for this property yet.
                  </p>
                ) : (
                  <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Select a property to view its reviews.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color, theme }) {
  return (
    <div
      className={`flex justify-between items-center p-5 rounded-xl shadow-md transition-shadow duration-300 ${
        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div>
        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
          {title}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg flex items-center justify-center text-2xl ${color} shadow-sm`}>
        {icon}
      </div>
    </div>
  );
}
