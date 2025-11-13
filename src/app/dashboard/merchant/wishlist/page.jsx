// "use client";

// import { useEffect, useState } from "react";
// import { useApp } from "@/context/AppContext";
// import { toast } from "react-toastify";
// import { LiaSpinnerSolid } from "react-icons/lia";
// import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
// import Image from "next/image";

// export default function WishlistPage() {
//   const { BASE_URL, merchantToken, merchant } = useApp();
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const merchantId = merchant?._id || merchant?.id;

//     if (!merchantToken || !merchantId) return;

//     const fetchWishlist = async () => {
//       try {
//         const res = await fetch(
//           `${BASE_URL}/merchants/${merchantId}/wishlist`,
//           {
//             headers: {
//               Authorization: `Bearer ${merchantToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await res.json();
//         console.log("🧩 Wishlist Response:", data);

//         if (!res.ok) throw new Error(data?.msg || "Failed to load wishlist");

//         setWishlist(data?.data || []);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [merchantToken, merchant, BASE_URL]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-[40vh]">
//         <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
//       </div>
//     );

//   if (!wishlist.length)
//     return (
//       <div className="text-center py-20 text-gray-500">
//         <FaHeart className="mx-auto mb-2 text-pink-400" size={40} />
//         <p>No properties in wishlist yet.</p>
//       </div>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
//         <FaHeart className="text-pink-500" /> My Wishlist
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {wishlist.map((item) => (
//           <div
//             key={item.id || item._id}
//             className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
//           >
//             <Image
//               src={item.image || "/placeholder.png"}
//               alt={item.title}
//               width={300}
//               height={300}
//               className="w-full h-40 object-cover rounded-md mb-3"
//             />
//             <h3 className="text-lg font-medium">{item.title}</h3>
//             <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
//               <FaMapMarkerAlt className="text-blue-500" /> {item.address}
//             </p>
//             <p className="text-blue-600 font-semibold">
//               ₦{Number(item.price).toLocaleString("en-NG")}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";

export default function WishlistPage() {
  const { BASE_URL, merchantToken, merchant, theme } = useApp();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wishlist
  useEffect(() => {
    const merchantId = merchant?._id || merchant?.id;

    if (!merchantToken || !merchantId) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/merchants/${merchantId}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${merchantToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log("🧩 Wishlist Response:", data);

        if (!res.ok) throw new Error(data?.msg || "Failed to load wishlist");

        setWishlist(data?.data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [merchantToken, merchant, BASE_URL]);

  // Theming Helpers
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#121212]" : "bg-gray-50";
  const cardBg = isDark ? "bg-[#1E1E1E] border-gray-700" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  if (loading)
    return (
      <div className={`flex justify-center items-center min-h-[40vh] ${bgColor}`}>
        <LiaSpinnerSolid
          className="animate-spin text-[#3A2B66]"
          size={50}
        />
      </div>
    );

  if (!wishlist.length)
    return (
      <div className={`text-center py-20 ${bgColor} ${textSecondary}`}>
        <FaHeart className="mx-auto mb-2 text-pink-400" size={40} />
        <p>No properties in wishlist yet.</p>
      </div>
    );

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300`}>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id || item._id}
            className={`border rounded-xl shadow-sm p-4 hover:shadow-md transition ${cardBg}`}
          >
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              width={300}
              height={300}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className={`text-lg font-medium ${textPrimary}`}>{item.title}</h3>
            <p className={`text-sm mb-2 flex items-center gap-1 ${textSecondary}`}>
              <FaMapMarkerAlt className="text-blue-500" /> {item.address}
            </p>
            <p className="text-blue-600 font-semibold">
              ₦{Number(item.price).toLocaleString("en-NG")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

