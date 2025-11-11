"use client";

import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MerchantDashboard() {
  const { merchantToken, agent, agentToken, BASE_URL, merchant } = useApp();
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
        const [agentsRes, usersRes, wishRes, propsRes] = await Promise.all([
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
        console.log("Overview fetch error:", error);
      }
    };

    fetchOverview();
  }, [merchantToken, merchant, agentToken, agent]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Agents"
          value={overview.agents}
          color="bg-green-500"
        />
        <DashboardCard
          title="Users"
          value={overview.users}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Properties"
          value={overview.properties}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Wishlists"
          value={overview.wishlists}
          color="bg-red-500"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }) {
  return (
    <div className={`p-6 text-white rounded-xl shadow-md ${color}`}>
      <h2 className="text-lg">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
