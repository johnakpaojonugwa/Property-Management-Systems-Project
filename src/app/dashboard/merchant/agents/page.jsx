"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";

export default function Agents() {
  const { merchantToken, BASE_URL, theme } = useApp();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch agents
  const fetchAgents = async () => {
    if (!merchantToken || !BASE_URL) return;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/merchants/agents?limit=20`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${merchantToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

      setAgents(data?.data || []);
    } catch (err) {
      toast.error(err.message || "Unable to load agents");
    } finally {
      setLoading(false);
    }
  };

  // Verify or unverify agent
  const verifyAgent = async (id, currentStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/merchants/verify-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${merchantToken}`,
        },
        body: JSON.stringify({
          agent_id: id,
          is_verified: !currentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Verification failed");

      toast.success("Agent verification updated!");
      fetchAgents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete agent
  const deleteAgent = async (id) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const res = await fetch(`${BASE_URL}/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${merchantToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete agent");

      toast.success("Agent deleted successfully!");
      fetchAgents();
    } catch (err) {
      toast.error(err.message || "Error deleting agent");
    }
  };

  useEffect(() => {
    if (merchantToken) fetchAgents();
  }, [merchantToken]);

  // Theme classes
  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-gray-900" : "bg-gray-50";
  const bgCard = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  const SkeletonGrid = () => (
    <div className={`${bgCard} shadow-md border rounded-xl p-4 animate-pulse`}>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-gray-400/30 w-24 h-24 sm:w-32 sm:h-32" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-400/30 rounded w-3/4"></div>
          <div className="h-3 bg-gray-400/30 rounded w-1/2"></div>
          <div className="h-3 bg-gray-400/30 rounded w-1/3"></div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-4 bg-gray-400/30 rounded w-1/4"></div>
        <div className="h-4 bg-gray-400/30 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${textPrimary}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-4">
        <Link
          href="/dashboard/merchant/agents/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          <FaPlus /> Create Agent
        </Link>
      </div>

      {/* Agent List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonGrid key={i} />
          ))}
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`${bgCard} shadow-md border rounded-xl p-5 transition-transform hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/default-avatar2.jpg"
                  alt="Agent Avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover border w-24 h-24 sm:w-32 sm:h-32"
                />
                <div>
                  <h3 className={`font-semibold text-lg ${textPrimary}`}>{agent.full_name}</h3>
                  <p className={`text-sm ${textSecondary}`}>{agent.email}</p>
                  <p className={`text-xs ${textSecondary}`}>{agent.phone}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex justify-between text-sm">
                <Link
                  href={`/dashboard/merchant/agents/${agent.id}`}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  View Details
                </Link>

                <button
                  onClick={() => verifyAgent(agent.id, agent.is_verified)}
                  className={`flex items-center gap-1 transition-colors ${
                    agent.is_verified
                      ? "text-green-500 hover:text-green-600"
                      : "text-yellow-500 hover:text-yellow-600"
                  }`}
                >
                  {agent.is_verified ? (
                    <>
                      <FaCheckCircle /> Verified
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Verify
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteAgent(agent.id)}
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${textSecondary} text-center mt-10`}>No agents found.</p>
      )}
    </div>
  );
}
