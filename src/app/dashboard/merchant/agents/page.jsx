"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";

export default function Agents() {
  const { merchantToken, BASE_URL } = useApp();
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

  //  Delete agent
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Merchant Agents</h1>

        <Link
          href="/dashboard/merchant/agents/create"
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          <FaPlus /> Create Agent
        </Link>
      </div>

      {/* Agent List */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white shadow-md border border-gray-100 rounded-xl p-4 transition-transform hover:scale-[1.02]"
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
                  <h3 className="font-semibold text-lg">{agent.full_name}</h3>
                  <p className="text-gray-500 text-sm">{agent.email}</p>
                  <p className="text-gray-400 text-xs">{agent.phone}</p>
                </div>
              </div>

              {/* ✅ New section for actions */}
              <div className="mt-4 flex justify-between text-sm">
                <Link
                  href={`/dashboard/merchant/agents/${agent.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>

                <button
                  onClick={() => verifyAgent(agent.id, agent.is_verified)}
                  className={`flex items-center gap-1 ${
                    agent.is_verified
                      ? "text-green-600 hover:text-green-700"
                      : "text-yellow-600 hover:text-yellow-700"
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
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No agents found.</p>
      )}
    </div>
  );
}
