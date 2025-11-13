// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useApp } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import PropertyCard from "@/components/PropertyCard";
// import {
//   FaArrowLeft,
//   FaHome,
//   FaEdit,
//   FaTrashAlt,
//   FaEnvelope,
//   FaBuilding,
// } from "react-icons/fa";
// import Link from "next/link";
// import { LiaSpinnerSolid } from "react-icons/lia";

// export default function AgentDetails() {
//   const { id } = useParams();
//   const { BASE_URL, merchantToken, agentToken, userToken, user, theme } = useApp();
//   const [agent, setAgent] = useState(null);
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     if (!merchantToken) {
//       toast.error("Please login first!");
//       router.push("/login");
//       return;
//     }

//     const fetchAllAgents = async () => {
//       try {
//         let foundAgent = null;
//         let page = 0;
//         const limit = 5;
//         let morePages = true;

//         while (morePages && !foundAgent) {
//           const res = await fetch(
//             `${BASE_URL}/merchants/agents?offset=${page}&limit=${limit}`,
//             {
//               headers: { Authorization: `Bearer ${merchantToken}` },
//             }
//           );
//           const data = await res.json();

//           if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

//           foundAgent = data?.data?.find((a) => a.id === id);
//           morePages = data?.data?.length > 0 && (page + 1) * limit < data?.total;
//           page++;
//         }

//         if (!foundAgent) throw new Error("Agent not found");
//         setAgent(foundAgent);

//         const resProps = await fetch(
//           `${BASE_URL}/properties?agent=${id}&verified=true&merchant`,
//           {
//             headers: { Authorization: `Bearer ${agentToken}` },
//           }
//         );
//         const agentData = await resProps.json();

//         const userRes = await fetch (`${BASE_URL}/users/${user.id}/properties`, {
//           headers: { Authorization: `Bearer ${userToken}` },
//         });
//         const userData = await userRes.json();

//         const availableProperties = (agentData.data || []).map((p) => ({
//           ...p,
//           isBought: false,
//           market_status: "AVAILABLE",
//         }));

//         const boughtProperties = (userData.data || []).filter(p => p.agentId === id).map((p) => ({
//           ...p,
//           isBought: true,
//           market_status: "BOUGHT",
//         }));

//         const combined = [...availableProperties, ...boughtProperties];
//         setProperties(combined);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllAgents();
//   }, [id, merchantToken, BASE_URL, router]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-[40vh]">
//         <LiaSpinnerSolid
//           className="animate-spin text-blue-600 dark:text-blue-400"
//           size={50}
//         />
//       </div>
//     );

//   if (!agent)
//     return (
//       <div className="text-center py-20 text-gray-500 dark:text-gray-400">
//         <p>Agent not found.</p>
//       </div>
//     );

//   return (
//     <div
//       className={`p-6 transition-all duration-300 ${
//         theme === "dark" ? "bg-[#0b0b0f] text-gray-200" : "bg-gray-50 text-gray-800"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6 mx-auto max-w-6xl">
//         <h1 className="text-xl font-bold">Agent Details</h1>
//         <Link
//           href="/dashboard/merchant/agents"
//           className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
//         >
//           <FaArrowLeft className="mr-2" /> Back
//         </Link>
//       </div>

//       {/* Agent Profile Card */}
//       <div
//         className={`rounded-2xl p-6 max-w-6xl mx-auto mb-8 shadow-md border transition-all duration-300 ${
//           theme === "dark"
//             ? "bg-[#151521] border-[#2a2a3b]"
//             : "bg-white border-gray-200"
//         }`}
//       >
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">
//               {agent.full_name || "Unnamed Agent"}
//             </h2>
//             <p className="text-sm mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <FaBuilding className="text-blue-500" />
//               {agent.company || "No company specified"}
//             </p>
//             <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <FaEnvelope className="text-blue-500" />
//               {agent.email}
//             </p>
//           </div>

//           <div className="flex flex-col justify-center items-start md:items-end">
//             <p className="text-sm font-medium">
//               Status:{" "}
//               <span
//                 className={`px-3 py-1 rounded-lg font-semibold ${
//                   agent.is_verified
//                     ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
//                     : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
//                 }`}
//               >
//                 {agent.is_verified ? "Verified" : "Pending Verification"}
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Properties Section */}
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <FaHome className="text-blue-600 dark:text-blue-400" /> Properties by this Agent
//         </h2>

//         {properties.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400 text-sm">
//             No properties assigned yet.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {properties.map((p) => (
//               <div
//                 key={p.id}
//                 className={`rounded-2xl overflow-hidden shadow-md transition-all duration-300 border hover:shadow-lg ${
//                   theme === "dark"
//                     ? "bg-[#1b1b29] border-[#2a2a3b]"
//                     : "bg-white border-gray-200"
//                 }`}
//               >
//                 <PropertyCard
//                   property={p}
//                   id={p.id}
//                   imageSrc={p.images?.[0] || "/placeholder.jpg"}
//                   title={p.name}
//                   location={`${p.city || ""}, ${p.state || ""}`}
//                   price={`₦${Number(p.price)?.toLocaleString()}`}
//                   bedrooms={p.bedroom || 0}
//                   bathrooms={p.bathroom || 0}
//                   area={p.total_area || "N/A"}
//                   isBought={p.market_status === "BOUGHT"}
//                 />

//                 <div
//                   className={`flex items-center justify-between p-3 border-t transition-colors ${
//                     theme === "dark"
//                       ? "border-[#2a2a3b] bg-[#141421]"
//                       : "border-gray-100 bg-gray-50"
//                   }`}
//                 >
//                   <Link
//                     href={`/dashboard/agent/properties/${p.id}/edit`}
//                     className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
//                   >
//                     <FaEdit /> Edit
//                   </Link>

//                   <button
//                     onClick={() => deleteProperty(p.id)}
//                     className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium hover:underline"
//                   >
//                     <FaTrashAlt /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






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
  const { BASE_URL, merchantToken, agentToken, userToken, user, theme } = useApp();
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

    const fetchAgentAndProperties = async () => {
      try {
        // Fetch agent details
        let foundAgent = null;
        let page = 0;
        const limit = 5;
        let morePages = true;

        while (morePages && !foundAgent) {
          const res = await fetch(
            `${BASE_URL}/merchants/agents?offset=${page}&limit=${limit}`,
            { headers: { Authorization: `Bearer ${merchantToken}` } }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data?.msg || "Failed to fetch agents");

          foundAgent = data?.data?.find((a) => a.id === id);
          morePages = data?.data?.length > 0 && (page + 1) * limit < data?.total;
          page++;
        }

        if (!foundAgent) throw new Error("Agent not found");
        setAgent(foundAgent);

        // Fetch available properties for this agent
        const resProps = await fetch(
          `${BASE_URL}/properties?agent=${id}&verified=true&merchant`,
          { headers: { Authorization: `Bearer ${agentToken}` } }
        );
        const agentData = await resProps.json();
        if (!resProps.ok) throw new Error(agentData?.msg || "Failed to fetch properties");

        // Fetch user-owned properties
        const userRes = await fetch(`${BASE_URL}/users/${user.id}/properties`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const userData = await userRes.json();

        const availableProperties = (agentData.data || []).map((p) => ({
          ...p,
          isBought: false,
          market_status: "AVAILABLE",
        }));

        const boughtProperties = (userData.data || [])
          .filter((p) => p.foundAgent === id)
          .map((p) => ({
            ...p,
            isBought: true,
            market_status: "BOUGHT",
          }));

        setProperties([...availableProperties, ...boughtProperties]);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentAndProperties();
  }, [id, merchantToken, BASE_URL, agentToken, userToken, user, router]);

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LiaSpinnerSolid
          className="animate-spin text-blue-600 dark:text-blue-400"
          size={50}
        />
      </div>
    );

  // No agent found
  if (!agent)
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        <p>Agent not found.</p>
      </div>
    );

  // Theme classes
  const isDark = theme === "dark";

  return (
    <div
      className={`p-6 transition-all duration-300 ${
        isDark ? "bg-[#0b0b0f] text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mx-auto max-w-6xl">
        <h1 className="text-xl font-bold">Agent Details</h1>
        <Link
          href="/dashboard/merchant/agents"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back
        </Link>
      </div>

      {/* Agent Profile */}
      <div
        className={`rounded-2xl p-6 max-w-6xl mx-auto mb-8 shadow-md border transition-all duration-300 ${
          isDark ? "bg-[#151521] border-[#2a2a3b]" : "bg-white border-gray-200"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {agent.full_name || "Unnamed Agent"}
            </h2>
            <p className="text-sm mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaBuilding className="text-blue-500" />
              {agent.company || "No company specified"}
            </p>
            <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaEnvelope className="text-blue-500" />
              {agent.email}
            </p>
          </div>

          <div className="flex flex-col justify-center items-start md:items-end">
            <p className="text-sm font-medium">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-lg font-semibold ${
                  agent.is_verified
                    ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
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
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaHome className="text-blue-600 dark:text-blue-400" /> Properties by this Agent
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No properties assigned yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl overflow-hidden shadow-md transition-all duration-300 border hover:shadow-lg ${
                  isDark ? "bg-[#1b1b29] border-[#2a2a3b]" : "bg-white border-gray-200"
                }`}
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

                <div
                  className={`flex items-center justify-between p-3 border-t transition-colors ${
                    isDark ? "border-[#2a2a3b] bg-[#141421]" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <Link
                    href={`/dashboard/agent/properties/${p.id}/edit`}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    <FaEdit /> Edit
                  </Link>

                  <button
                    onClick={() => deleteProperty(p.id)}
                    className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium hover:underline"
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
