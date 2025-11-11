"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AgentProfile() {
  const { agentToken, agent, merchantToken, BASE_URL } = useApp();

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState(agent);

  // Fetch agent details
  useEffect(() => {
    if (!merchantToken) {
      toast.error("Please login first!");
      return;
    }

    const fetchAllAgents = async () => {
      try {
        setLoading(true);
        let foundAgent = null;
        let page = 0;
        const limit = 5;
        let morePages = true;

        while (morePages && !foundAgent) {
          const res = await fetch(
            `${BASE_URL}/merchants/agents?offset=${
              page * limit
            }&limit=${limit}`,
            {
              headers: { Authorization: `Bearer ${merchantToken}` },
            }
          );

          const data = await res.json();
          if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

          foundAgent = data?.data?.find((a) => a.id === agent.id);
          morePages = data?.data?.length === limit;
          page++;
        }

        if (!foundAgent) throw new Error("Agent not found");
        setAgentData(foundAgent);
        console.log("AgentData:", foundAgent)
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
        setUploading(false);
      }
    };

    fetchAllAgents();
  }, [merchantToken, BASE_URL]);

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await fetch(`${BASE_URL}/agents/${agentData?.id}/resource`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${agentToken}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to upload avatar");

      setAgentData((prev) => ({ ...prev, avatar: data?.data?.avatar }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="rounded-full bg-gray-200 w-32 h-32"></div>
            <div className="flex-1 space-y-3 w-full">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-2/4 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No agent found
  if (!agentData) {
    return (
      <div className="p-8 text-center text-gray-500">
        No agent information found. Please log in again.
      </div>
    );
  }

  // Loaded view
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        Agent Profile
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <Image
              src="/default-avatar2.jpg"
              alt="Agent Avatar"
              width={100}
              height={100}
              className="rounded-full object-cover border w-24 h-24 sm:w-32 sm:h-32"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
            >
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">
              {agentData?.full_name || "Agent Name"}
            </h2>
            <p className="text-gray-500">{agentData?.email}</p>
            <p className="mt-2 inline-block px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
              Agent Role: {agent?.role}
            </p>
          </div>
        </div>

        {uploading && (
          <p className="text-blue-600 text-sm mt-3 animate-pulse">
            Uploading image...
          </p>
        )}

        <div className="mt-6 space-y-3 text-gray-700">
          <p>
            <strong>Company:</strong> {agentData?.company || "Not provided"}
          </p>
          <p>
            <strong>Agent ID:</strong> {agentData?.id || "—"}
          </p>
          <p className=" ">
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold px-3 py-1 text-xs bg-green-500 w-30 text-white ${
                agentData?.is_verified
                  ? "text-green-600 uppercase"
                  : "text-yellow-600"
              }`}
            >
              {agentData.is_verified ? "Verified" : "Pending Verification"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
