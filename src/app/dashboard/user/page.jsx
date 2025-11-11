"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { FaHome, FaHeart } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";

export default function UserDashboard() {
  const { userToken, BASE_URL, user, theme } = useApp();
  const [properties, setProperties] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const fetchProperties = async () => {
    if (!userToken || !userId) return toast.error("Missing credentials");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/properties`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to fetch properties");

      const boughtProperties = (data.data || []).map((p) => ({
        ...p,
        isBought: true,
        market_status: "BOUGHT",
      }));
      setProperties(boughtProperties || []);
    } catch (err) {
      toast.error(err.message || "Error fetching properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlists = async () => {
    if (!userToken || !userId) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/wishlist`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Failed to fetch wishlists");

      const boughtProperties = (data.data || []).map((p) => ({
        ...p,
        isBought: true,
        market_status: "BOUGHT",
      }));
      setWishlists(boughtProperties || []);
    } catch (err) {
      toast.error(err.message || "Error fetching wishlists");
    }
  };

  useEffect(() => {
    if (userToken && userId) {
      fetchProperties();
      fetchWishlists();
    }
  }, [userToken, userId]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`border rounded-2xl shadow-sm animate-pulse ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="w-full h-56 rounded-t-2xl bg-gray-200"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* ===== Overview Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties Card */}
        <div
          className={`flex justify-between items-center p-5 rounded-xl shadow-md hover:shadow-lg ${
            theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"
          }`}
        >
          <div>
            <p className="text-sm text-gray-400">Total Properties</p>
            <h3 className="text-2xl font-bold">{properties.length}</h3>
          </div>
          <div className="p-3 rounded-md bg-blue-100 text-blue-500 flex items-center justify-center">
            <FaHome size={24} />
          </div>
        </div>

        {/* Wishlists Card */}
        <div
          className={`flex justify-between items-center p-5 rounded-xl shadow-md hover:shadow-lg ${
            theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"
          }`}
        >
          <div>
            <p className="text-sm text-gray-400">Wishlists</p>
            <h3 className="text-2xl font-bold">{wishlists.length}</h3>
          </div>
          <div className="p-3 rounded-md bg-green-100 text-green-500 flex items-center justify-center">
            <FaHeart size={24} />
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          {/* My Properties Card Wrapper */}
          <div
            className={`p-6 rounded-2xl shadow-md transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaHome className="text-blue-500" /> My Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.length > 0 ? (
                properties.map((p) => (
                  <PropertyCard
                    key={p.id}
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
                ))
              ) : (
                <p className="text-gray-500">No properties found.</p>
              )}
            </div>
          </div>

          {/* My Wishlists Card Wrapper */}
          <div
            className={`p-6 rounded-2xl shadow-md transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaHeart className="text-green-500" /> My Wishlists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlists.length > 0 ? (
                wishlists.map((w) => (
                  <PropertyCard
                    key={w.id}
                    id={w.property?.id}
                    imageSrc={w.property?.image || "/placeholder.jpg"}
                    title={w.property?.name}
                    location={`${w.property?.city || ""}, ${w.property?.state || ""}`}
                    price={`₦${Number(w.property?.price)?.toLocaleString()}`}
                    bedrooms={w.property?.bedroom || 0}
                    bathrooms={w.property?.bathroom || 0}
                    area={w.property?.total_area || "N/A"}
                    isBought={w.market_status === "BOUGHT"}
                  />
                ))
              ) : (
                <p className="text-gray-500">No wishlists found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}









// "use client";

// import { useEffect, useState } from "react";
// import { useApp } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import { FaHome, FaCalendarAlt } from "react-icons/fa";
// import PropertyCard from "@/components/PropertyCard";

// export default function UserDashboard() {
//   const { userToken, BASE_URL, user } = useApp();
//   const [properties, setProperties] = useState([]);
//   const [wishlists, setWishlists] = useState([]);
//   const [loading, setLoading] = useState(false);

// const userId = user?.id;

//   const fetchProperties = async () => {
//     if (!userToken || !userId) return toast.error("Missing credentials");

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/users/${userId}/properties`, {
//         headers: { Authorization: `Bearer ${userToken}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.msg || "Failed to fetch properties");

//       const boughtProperties = (data.data || []).map((p) => ({
//         ...p,
//         isBought: true,
//         market_status: "BOUGHT",
//       }));
//       setProperties(boughtProperties || []);
//       console.log("Properties Bought details", boughtProperties)
//     } catch (err) {
//       toast.error(err.message || "Error fetching properties");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWishlists = async () => {
//     if (!userToken || !userId) return;
//     try {
//       const res = await fetch(`${BASE_URL}/users/${userId}/wishlist`, {
//         headers: { Authorization: `Bearer ${userToken}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.msg || "Failed to fetch wishlists");

//       const boughtProperties = (data.data || []).map((p) => ({
//         ...p,
//         isBought: true,
//         market_status: "BOUGHT",
//       }));
//       setWishlists(boughtProperties || []);
//     } catch (err) {
//       toast.error(err.message || "Error fetching wishlists");
//     }
//   };

//   useEffect(() => {
//     if (userToken && userId) {
//       fetchProperties();
//       fetchWishlists();
//     }
//   }, [userToken, userId]);

//   // Skeleton loader
//   const SkeletonGrid = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className="border border-gray-100 bg-white rounded-2xl shadow-sm animate-pulse"
//         >
//           <div className="w-full h-56 bg-gray-200 rounded-t-2xl"></div>
//           <div className="p-5 space-y-3">
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="p-6">
//       {/* Overview */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
//           <FaHome className="text-blue-500 text-3xl" />
//           <div>
//             <p className="text-gray-500 text-sm">Total Properties</p>
//             <h3 className="text-xl font-semibold">{properties.length}</h3>
//           </div>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-3">
//           <FaCalendarAlt className="text-green-500 text-3xl" />
//           <div>
//             <p className="text-gray-500 text-sm">Wishlists</p>
//             <h3 className="text-xl font-semibold">{wishlists.length}</h3>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <SkeletonGrid />
//       ) : (
//         <>
//           {/* Properties */}
//           <section className="mb-10">
//             <h2 className="text-lg font-semibold mb-3">My Properties</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {properties.length > 0 ? (
//                 properties.map((p) => (
//                   <PropertyCard
//                     key={p.id}
//                     id={p.id}
//                     imageSrc={p.images?.[0] || "/placeholder.jpg"}
//                     title={p.name}
//                     location={`${p.city || ""}, ${p.state || ""}`}
//                     price={`₦${Number(p.price)?.toLocaleString()}`}
//                     bedrooms={p.bedroom || 0}
//                     bathrooms={p.bathroom || 0}
//                     area={p.total_area || "N/A"}
//                     isBought={p.market_status === "BOUGHT"}
//                   />
//                 ))
//               ) : (
//                 <p className="text-gray-500">No properties found.</p>
//               )}
//             </div>
//           </section>

//           {/* Wishlists */}
//           <section>
//             <h2 className="text-lg font-semibold mb-3">My Wishlists</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {wishlists.length > 0 ? (
//                 wishlists.map((w) => (
//                   <PropertyCard
//                     key={w.id}
//                     id={w.property?.id}
//                     imageSrc={w.property?.image || "/placeholder.jpg"}
//                     title={w.property?.name}
//                     location={`${w.property?.city || ""}, ${w.property?.state || ""}`}
//                     price={`₦${Number(w.property?.price)?.toLocaleString()}`}
//                     bedrooms={w.property?.bedroom || 0}
//                     bathrooms={w.property?.bathroom || 0}
//                     area={w.property?.total_area || "N/A"}
//                     isBought={w.market_status === "BOUGHT"}
//                   />
//                 ))
//               ) : (
//                 <p className="text-gray-500">No wishlists found.</p>
//               )}
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }


