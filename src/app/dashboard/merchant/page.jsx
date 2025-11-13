"use client";

import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers, FaUserTie, FaHome, FaHeart } from "react-icons/fa";

export default function MerchantDashboard() {
  const { merchantToken, agent, agentToken, BASE_URL, merchant, theme } =
    useApp();
  const [overview, setOverview] = useState({
    agents: 0,
    users: 0,
    properties: 0,
    wishlists: 0,
  });

  const merchantId = merchant?._id || merchant?.id;
  const agentId = agent?._id || agent?.id;

  useEffect(() => {
    if (!merchantToken || !merchant || !agent || !agentToken) return;

    const fetchOverview = async () => {
      try {
        const [agentsRes, usersRes, propsRes, wishRes] = await Promise.all([
          axios.get(`${BASE_URL}/merchants/agents?offset=0&limit=50`, {
            headers: { Authorization: `Bearer ${merchantToken}` },
          }),
          axios.get(`${BASE_URL}/users?limit=5&page=1`, {
            headers: { Authorization: `Bearer ${merchantToken}` },
          }),
          axios.get(
            `${BASE_URL}/properties?agent=${agentId}&verified=true&merchant=${merchantId}`,
            { headers: { Authorization: `Bearer ${agentToken}` } }
          ),
          axios.get(`${BASE_URL}/merchants/${merchantId}/wishlist`, {
            headers: { Authorization: `Bearer ${merchantToken}` },
          }),
        ]);

        setOverview({
          agents: agentsRes.data?.data?.length || 0,
          users: usersRes.data?.data?.length || 0,
          properties: propsRes.data?.data?.length || 0,
          wishlists: wishRes.data?.data?.length || 0,
        });
      } catch (error) {
        toast.error(error.message || "Error fetching overview data");
        console.log("Overview fetch error:", error);
      }
    };

    fetchOverview();
  }, [merchantToken, merchant, agentToken, agent]);

  const cards = [
    {
      title: "Agents",
      value: overview.agents,
      icon: <FaUserTie size={24} />,
      color: "bg-green-100 text-green-500",
    },
    {
      title: "Users",
      value: overview.users,
      icon: <FaUsers size={24} />,
      color: "bg-blue-100 text-blue-500",
    },
    {
      title: "Properties",
      value: overview.properties,
      icon: <FaHome size={24} />,
      color: "bg-purple-100 text-purple-500",
    },
    {
      title: "Wishlists",
      value: overview.wishlists,
      icon: <FaHeart size={24} />,
      color: "bg-red-100 text-red-500",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((c) => (
          <DashboardCard
            key={c.title}
            title={c.title}
            value={c.value}
            icon={c.icon}
            color={c.color}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color, theme }) {
  return (
    <div
      className={`flex justify-between items-center p-5 rounded-xl shadow-md transition-shadow duration-300 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {title}
        </p>

        <h3 className="text-2xl md:text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-lg flex items-center justify-center text-2xl ${color} shadow-sm`}
      >
        {icon}
      </div>
    </div>
  );
}
