"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { FaHome } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineHeadset } from "react-icons/md";
import { LuBookText } from "react-icons/lu";
import { TbNotes } from "react-icons/tb";
import Card from "@/components/Card";
import PropertyCard from "@/components/PropertyCard";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";

export default function HomePage() {
  const { BASE_URL, agent, agentToken, user, userToken } = useApp();
  const [allProperties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  //fetching all properties
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

  // 💖 Fetch user wishlist
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
    <main className="font-sans">
      <Nav />
      <HeroSection />

      {/* Info Section */}
      <section>
        <div className="w-[70%] mx-auto my-15 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A2B66] leading-tight mb-2">
            Your partner in building generational wealth via real estate
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-6 max-w-3xl mx-auto px-4 md:px-6">
            We guide you through the entire journey, from search to inspection,
            to secure a purchase. We are not just a property platform; we are
            your trusted real estate advisor and partner.
          </p>
        </div>

        {/* grid cards */}
        <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:w-[95%] xl:w-[60%] mx-auto md:mb-20 mb-10">
          <Card
            icon={<FaHome />}
            title="Verified Listings"
            description="Carefully sourced and vetted through developer documentation and on-site inspections."
          />
          <Card
            icon={<HiOutlineShieldCheck />}
            title="Clear Payment Plans"
            description="Flexible installment options and diaspora-friendly mortgage plans designed around your needs."
          />
          <Card
            icon={<FiUserPlus />}
            title="Professional Expert Guidance"
            description="Detailed consultations with experienced realtors, ensuring your decisions are secure and informed."
          />
          <Card
            icon={<LuBookText />}
            title="Buyer Toolkits and Resources"
            description="Webinars, checklists, and guides to make your buying process transparent and stress-free."
          />
          <Card
            icon={<MdOutlineHeadset />}
            title="24/7 Human Support"
            description="Our team is available anytime to assist you from start to finish."
          />
          <Card
            icon={<TbNotes />}
            title="Legal & Documentation Assistance"
            description="We help ensure your transaction is secure, lawful, and worry-free."
          />
        </div>
      </section>

      {/* listings section */}
      <section id="listings" className="bg-[#f7f7f7] w-full my-15 py-20">
        <div className="w-[80%] mx-auto text-center pb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A2B66] leading-tight mb-2">
            See Listings Curated for You
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-6 max-w-3xl mx-auto px-4 md:px-6">
            Verified options in high-demand areas. Flexible payment plans. No
            agent runaround.
          </p>
        </div>

        {/* grid cards */}
        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:w-[95%] xl:w-[60%] mx-auto md:mb-20 mb-10">
            {allProperties.map((property, index) => (
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
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mx-auto text-center">
          <button className="bg-[#3A2B66] hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-medium transition cursor-pointer">
            View More Listings
          </button>
          <button className="border border-[#3A2B66] hover:bg-[#3A2B66] hover:text-white text-[#3A2B66] px-6 py-3 rounded-xl font-medium transition cursor-pointer">
            Send Your Property Request
          </button>
        </div>
      </section>

      {/* Image card */}
      <section className="py-10 bg-white">
        <div className="w-[90%] lg:w-[95%] xl:w-[60%] mx-auto flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Left Side — Image + Title */}
          <div className="lg:w-1/2 w-full flex flex-col lg:text-left">
            <Card
              imageSrc="/Modern property interior.jpg"
              title="How It Works"
              description="We keep things simple, transparent, and human."
            />
          </div>

          {/* Right Side — Steps */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
              text="01"
              title="Tell Us What You Need"
              description="Share your budget, ideal location, and buying goals."
            />

            <Card
              text="02"
              title="Get Curated Options"
              description="We match you with properties that suit you, nothing random."
            />

            <Card
              text="03"
              title="Inspect & Verify"
              description="Walk through it in-person or virtually. We also do due diligence on your behalf."
            />

            <Card
              text="04"
              title="Make an Offer & Secure It"
              description="We guide you through offers, paperwork, and trusted payments."
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-[#f7f7f7] w-full my-15 py-20">
        {/* Section Header */}
        <div className="w-[80%] md:w-[90%] xl:w-[60%] mx-auto text-center pb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A2B66] leading-tight mb-3">
            Over 200 Diaspora-Focused Support, Trusted Clients Served
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-6 max-w-3xl mx-auto px-4 md:px-6">
            See the difference between traditional property buying and our
            streamlined approach
          </p>
        </div>

        {/* Card Grid */}
        <div className="w-[95%] lg:w-[95%] xl:w-[60%] mx-auto flex flex-col md:flex-row items-start gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-md transition-all duration-300 flex flex-col items-start text-left p-6 hover:-translate-y-2">
            <Image
              src="/Buying Properties With Others.png"
              alt="Buying property with others"
              width={400}
              height={400}
              className="w-400 md:w-450 h-44 md:h-54 lg:h-80 object-contain md:object-contain lg:object-cover rounded-xl mb-6"
            />
            <h2 className="text-lg font-semibold text-[#3A2B66] mb-2">
              Buying Properties With Others
            </h2>
            <ul className="space-y-1 text-gray-600 list-disc pl-5 marker:text-red-500">
              <li>Unverified listings</li>
              <li>Hidden fees</li>
              <li>Slow response times</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-md transition-all duration-300 flex flex-col items-start text-left p-6 hover:-translate-y-2">
            <Image
              src="/Buying properties with BuyLetLive.png"
              alt="Buying property with BuyLetLive"
              width={400}
              height={400}
              className="w-400 md:w-450 h-44 md:h-54 lg:h-80 object-contain md:object-contain lg:object-cover rounded-xl mb-6"
            />
            <h2 className="text-lg font-semibold text-[#3A2B66] mb-3">
              Buying Properties With BuyLetLive
            </h2>
            <ul className="space-y-1 text-gray-600 list-disc pl-5 marker:text-green-500">
              <li>Verified listings</li>
              <li>Transparent pricing</li>
              <li>Dedicated support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mortgage Support Section */}
      <section>
        <div className="w-[90%] lg:w-[95%] xl:w-[60%] bg-[#3A2B66] mx-auto flex flex-col lg:flex-row items-start gap-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-md transition-all duration-300 flex flex-col items-start text-left p-6 hover:-translate-y-2">
          <div className="w-full lg:w-1/2 p-4">
            <Image
              src="/New homeowners receiving keys.jpg"
              alt="New homeowners receiving keys"
              width={400}
              height={400}
              className="w-400 md:w-full h-44 md:h-auto object-contain lg:object-cover rounded-xl lg:mb-6"
            />
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <h2 className="text-lg text-white font-semibold text-[#3A2B66] mb-2">
              Mortgage Support for Diaspora Buyers
            </h2>
            <p className="space-y-1 text-white/80 list-disc pl-5 marker:text-white">
              Access mortgage financing designed for Nigerians living abroad,
              with simplified processes and competitive rates.
            </p>
            <ul className="space-y-1 text-white/80 list-disc pl-5 marker:text-white">
              <li>Pre-approval in 48 hours</li>
              <li>Competitive interest rates from 15+ banks</li>
              <li>Up to 25-year payment terms</li>
              <li>Diaspora-friendly documentation process</li>
            </ul>
            <button className="border border-[#3A2B66] bg-white hover:bg-white/90 hover:text-[#3A2B66] text-[#3A2B66] text-xs px-6 py-3 rounded-full mt-5 font-medium transition cursor-pointer">
              Try Mortgage Calculator
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-16 text-center">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3A2B66] leading-tight mb-3">
            Don't Just Take Our Word for it
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Hear from Nigerian diaspora who have successfully purchased their
            dream properties with BuyLetLive
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start">
          {/* Testimonial 1 */}
          <div className="border border-gray-200 rounded-2xl p-6 text-left bg-white shadow-sm hover:shadow-md transition">
            {/* Rating + Google icon */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <FcGoogle size={20} />
            </div>

            {/* Testimonial text */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              "I was in Canada when I found a BuyLetLive listing. Now I own a
              home in Lagos and earn rental income."
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="bg-[#2b2340] text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full">
                IF
              </div>
              <div>
                <p className="font-semibold text-[#2b2340]">Ifeoma</p>
                <p className="text-gray-500 text-sm">Toronto, Canada</p>
                <p className="text-xs mt-1 inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-600 border border-gray-200">
                  Verified Client
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="border border-gray-200 rounded-2xl p-6 text-left bg-white shadow-sm hover:shadow-md transition">
            {/* Rating + Google icon */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <FcGoogle size={20} />
            </div>

            {/* Testimonial text */}
            <p className="text-gray-700 mb-6 leading-relaxed">
              "I had no idea how to buy in Nigeria. BuyLetLive explained
              everything and even helped with inspection logistics."
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="bg-[#2b2340] text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full">
                TO
              </div>
              <div>
                <p className="font-semibold text-[#2b2340]">Tolu</p>
                <p className="text-gray-500 text-sm">Abuja, Nigeria</p>
                <p className="text-xs mt-1 inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-600 border border-gray-200">
                  Verified Client
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <section
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="Backtotop bg-[#586370] text-gray-200 font-[13px] text-center py-[15px] cursor-pointer hover:bg-gray-600"
      >
        Back To Top
      </section>
      <Footer />
    </main>
  );
}
