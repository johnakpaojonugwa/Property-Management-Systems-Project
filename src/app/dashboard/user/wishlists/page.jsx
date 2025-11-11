"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import PropertyCard from "@/components/PropertyCard";

export default function WIshlists() {
  const { userToken, user, BASE_URL } = useApp();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;  

  const fetchWishlists = async () => {
      if (!userToken || !userId) return;
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (userToken && userId) {
      fetchWishlists();
    }
  }, [userToken, userId]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
        key={i}
        className="border border-gray-100 bg-white rounded-2xl shadow-sm animate-pulse"
        >
          <div className="w-full h-56 bg-gray-200 rounded-t-2xl"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6">
      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <section>
            <h2 className="text-lg font-semibold mb-3">My Wishlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlists.length > 0 ? (
                wishlists.map((w) => (
                  <PropertyCard 
                    key={w.id}
                    id={w.property?.id}
                    imageSrc={w.property?.image || "/placeholder.jpg"}
                    title={w.property?.name}
                    price={`₦${Number(w.property?.price)?.toLocaleString()}`}
                    isBought={w.market_status === "BOUGHT"}
                  />
                ))
              ) : (
                <p className="text-gray-500">No wishlists found.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}