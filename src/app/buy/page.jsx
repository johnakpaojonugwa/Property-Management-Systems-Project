"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import Card from "@/components/Card";
import { GoShieldCheck } from "react-icons/go";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
import Link from "next/link";

export default function BuyPage() {
  const { BASE_URL, agent, agentToken, user, userToken } = useApp();

  const [allProperties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch agent properties
  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoading(true);
      try {
        const agentRes = await fetch(
          `${BASE_URL}/properties?agent=${agent.id}&verified=true`,
          {
            headers: { Authorization: `Bearer ${agentToken}` },
          }
        );
        const agentData = await agentRes.json();

        const userRes = await fetch(`${BASE_URL}/users/${user.id}/properties`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const userData = await userRes.json();

        const availableProperties = (agentData.data || []).map((p) => ({
          ...p,
          isBought: false,
          market_status: "AVAILABLE",
        }));

        const boughtProperties = (userData.data || []).map((p) => ({
          ...p,
          isBought: true,
          market_status: "BOUGHT",
        }));

        const combined = [...availableProperties, ...boughtProperties];
        setProperties(combined);
      } catch (error) {
        console.log("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    if (agentToken && userToken) fetchAllProperties();
  }, [agentToken, userToken]);

  // Fetch user wishlist
  useEffect(() => {
    if (!userToken || !user) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${user?.id}/wishlist`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setWishlist(data?.data || []);
      } catch (err) {
        console.log("Error loading wishlist:", err);
        toast.error("Failed to load wishlist");
      }
    };
    fetchWishlist();
  }, [userToken, user, BASE_URL]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:w-[60%] w-[95%] md:w-[90%] lg:w-[90%] mx-auto">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-100 bg-white rounded-2xl shadow-sm animate-pulse"
        >
          <div className="w-full h-56 bg-gray-200 rounded-t-2xl"></div>
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
    <main>
      <Nav />
      {/* header section */}
      <section>
        <header className="w-[70%] mx-auto mt-30 mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A2B66] leading-tight mb-2">
            Buy Your Dream Property
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-6 max-w-3xl mx-auto px-4 md:px-6">
            Discover exclusive properties tailored for the diaspora community.
            From residential homes to investment opportunities, we help you find
            the perfect match.
          </p>
        </header>
      </section>

      <div className="w-[60%] mx-auto mb-10 text-left">
        <h1 className="md:text-3xl text-2xl text-center text-[#3A2B66] md:text-left leading-tight mb-2 font-bold">
          Properties for Sale
        </h1>
      </div>

      {/* grid cards */}
      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:w-[95%] xl:w-[60%] mx-auto md:mb-20 mb-10">
          {allProperties.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              No properties available.
            </p>
          ) : (
            allProperties.map((property, index) => (
              <div
                key={property._id || property.id || index}
                className="flex flex-col"
              >
                <PropertyCard
                  key={property._id || property.id || index}
                  id={property._id || property.id}
                  imageSrc={
                    property.image?.startsWith("http")
                      ? property.image
                      : `${BASE_URL}/uploads/${property.image}`
                  }
                  title={property.name || "Untitled Property"}
                  location={property.address || "Lagos, Nigeria"}
                  price={
                    property.price
                      ? `₦${Number(property.price).toLocaleString("en-NG")}`
                      : "Price on request"
                  }
                  bedrooms={property.bedroom || 0}
                  bathrooms={property.bathroom || 0}
                  area={property.total_area || "N/A"}
                  isBought={property.market_status === "BOUGHT"}
                />

                <Link
                  href={`/buy/${property._id || property.id}`}
                  className="mt-3 text-center bg-[#3a2b66] hover:bg-[#3a2b56] text-white px-5 py-2 rounded-md font-medium transition"
                >
                  Buy Now
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info cards */}
      <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:w-[95%] xl:w-[60%] mx-auto md:mb-20 mb-10">
        <Card
          icon={<FaHome />}
          title="Residential Properties"
          description="Find the perfect home for your family with our curated selection of residential properties."
        />
        <Card
          icon={<CiBank />}
          title="Investment Properties"
          description="Build your portfolio with high-yield investment opportunities in prime locations."
        />
        <Card
          icon={<GoShieldCheck />}
          title="Verified Listings"
          description="Every property is thoroughly vetted to ensure transparency and peace of mind."
        />
      </div>

      {/* button */}
      <Link href="/appointments">
        <div className="text-center mx-auto w-[60%] mt-10 mb-20">
          <button className="bg-[#3A2B66] hover:bg-[#3A2B56] text-white px-5 sm:px-6 py-3.5 sm:py-3 rounded-lg font-medium transition cursor-pointer text-xl sm:text-base shadow-md">
            Request Property
          </button>
        </div>
      </Link>

      <Footer />
    </main>
  );
}
