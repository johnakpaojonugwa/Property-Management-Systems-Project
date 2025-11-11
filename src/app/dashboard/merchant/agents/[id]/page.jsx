"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import PropertyCard from "@/components/PropertyCard";
import {
  FaArrowLeft,
  FaHome,
  FaEdit,
  FaTrashAlt,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";
import Link from "next/link";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function AgentDetails() {
  const { id } = useParams();
  const { BASE_URL, merchant, merchantToken, agentToken } = useApp();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  if (!merchantToken) {
    toast.error("Please login first!");
    router.push("/login");
    return;
  }

  const fetchAllAgents = async () => {
    try {
      let foundAgent = null;
      let page = 0;
      const limit = 5; 
      let morePages = true;

      while (morePages && !foundAgent) {
        const res = await fetch(`${BASE_URL}/merchants/agents?offset=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${merchantToken}` },
        });

        const data = await res.json();
        console.log(`🧩 Page ${page} Agent Response:`, data);

        if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

        // Try to find the matching agent
        foundAgent = data?.data?.find((a) => a.id === id);

        // Stop if we reached the last page
        morePages = data?.data?.length > 0 && (page + 1) * limit < data?.total;
        page++;
      }

      if (!foundAgent) throw new Error("Agent not found");
      setAgent(foundAgent);
      console.log("Found Agent:", foundAgent);

      // Fetch properties 
      const resProps = await fetch(`${BASE_URL}/properties?agent=${id}&verified=true&merchant`, {
        headers: { Authorization: `Bearer ${agentToken}` },
      });
      const propData = await resProps.json();
      console.log("🏠 Properties Response:", propData);
      if (resProps.ok) setProperties(propData?.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAllAgents();
}, [id, merchantToken, BASE_URL, router]);


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

  if (!agent)
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Agent not found.</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800">Agent Details</h1>
        <Link
          href="/dashboard/merchant/agents"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
      </div>

      {/* Agent Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border max-w-6xl mx-auto border-gray-100 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {agent.full_name || "Unnamed Agent"}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              <FaBuilding className="inline mr-1 text-blue-500" />
              {agent.company || "No company specified"}
            </p>
            <p className="text-sm text-gray-600">
              <FaEnvelope className="inline mr-2 text-blue-500" />
              {agent.email}
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-md text-white ${
                  agent.is_verified ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {agent.is_verified ? "Verified" : "Pending Verification"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FaHome className="text-blue-600" /> Properties by this Agent
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500 text-sm">No properties assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  href={`/dashboard/agent/properties/${p.id}/edit`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FaEdit /> Edit
                </Link>

                {/* <button
                  onClick={() => verifyProperty(p.id, !p.is_verified)}
                  className={`flex items-center gap-1 ${
                    p.is_verified
                      ? "text-green-600 hover:text-green-800"
                      : "text-gray-500 hover:text-blue-600"
                  } font-medium`}
                >
                  {p.is_verified ? (
                    <>
                      <FaCheckCircle /> Verified
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Verify
                    </>
                  )}
                </button> */}

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
        )}
      </div>
    </div>
  );
}
