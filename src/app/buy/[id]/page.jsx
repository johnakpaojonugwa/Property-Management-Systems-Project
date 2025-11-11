"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { LiaSpinnerSolid } from "react-icons/lia";
import {
  FaBed,
  FaShower,
  FaRulerCombined,
  FaHome,
  FaBath,
} from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";

export default function SinglePropertyBuyPage() {
  const { id } = useParams();
  const { apiFetch, user, getToken, BASE_URL } = useApp();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const token = getToken(user?.role || "USER");
        const data = await apiFetch(
          `/properties/${id}`,
          "GET",
          null,
          {},
          token
        );
        setProperty(data);
        const firstImage =
          data.image && data.image.startsWith("http")
            ? data.image
            : data.image
            ? `${BASE_URL}/uploads/${data.image}`
            : "/placeholder.jpg";

        setMainImage(firstImage);
      } catch (err) {
        console.log("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, apiFetch, getToken, user]);

  const handleBuy = async () => {
    if (!user) return toast.error("Please login to buy a property");
    setBuying(true);
    try {
      const token = getToken(user?.role || "USER");
      const body = { property_id: id, user_id: user.id };
      const res = await apiFetch("/properties/buy", "POST", body, {}, token);
      toast.success("Property purchase successful!");
      console.log("Purchase response:", res);
    } catch (err) {
      console.log("Buy failed:", err);
    } finally {
      setBuying(false);
    }
  };

  const offers = [
    "Gated Estate",
    "Serene Environment",
    "Security",
    "24hrs Electricity",
    "Good road accessibility",
    "CCTV Cameras",
    "Walk in Closet",
    "Service Charged",
    "Newly Built",
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LiaSpinnerSolid className="animate-spin text-[#3A2B66]" size={50} />
      </div>
    );

  if (!property)
    return (
      <p className="text-center text-gray-500 mt-10">Property not found</p>
    );

    const thumbnails = property?.images || [];


  return (
    <main className="w-full">
      <Nav />
      {/* Header */}
      <header className="max-w-7xl mx-auto mt-20 bg-white rounded-2xl p-8 mb-10 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.name || "2 Bedroom Apartment"}
            </h1>
            <p className="text-gray-500 flex items-center text-base">
              <CiLocationOn className="mr-1 text-blue-600 text-lg" />
              {property.address}
            </p>
          </div>

          <div className="text-right">
            <h4 className="text-3xl font-bold text-green-700">
              ₦{Number(property.price || 0).toLocaleString("en-NG")}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Property ID: {property.id || "N/A"}
            </p>
          </div>
        </div>
      </header>

      {/* Image Gallery (Main + Thumbnails Side by Side) */}
      <div className=" lg:col-span-2 max-w-7xl mx-auto mb-10">
        <div className="flex flex-row gap-6 items-start">
          {/* Main Image */}
          <div className="flex-1 max-w-[70%] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={mainImage || "/placeholder.jpg"}
              alt={property.name}
              width={800}
              height={600}
              className="object-contain w-full h-[800px] rounded-2xl bg-gray-50"
              priority
            />
          </div>

          {/* Thumbnails */}
          {thumbnails.length > 0 && (
            <div className="w-[30%] space-y-4 overflow-y-auto max-h-[800px]">
              {thumbnails.map((img, idx) => {
                const src = img.startsWith("http")
                  ? img
                  : `${BASE_URL}/uploads/${img}`;
                return (
                  <img
                    key={idx}
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`h-64 w-64 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                      mainImage === src
                        ? "border-blue-600 ring-2 ring-blue-300"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setMainImage(src)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Property Details & Sidebar */}
      <section className="max-w-7xl mx-auto flex flex-col mb-10 lg:flex-row gap-8 bg-white p-6 rounded-2xl border border-gray-100">
        {/* LEFT DETAILS */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.name || "2 Bedroom Apartment"}
            </h1>
            <p className="text-gray-500 flex items-center text-base">
              <CiLocationOn className="mr-1 text-blue-600 text-lg" />
              {property.address}
            </p>
          </div>
          <div>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
              Mortgage Enabled
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-gray-700 text-sm">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <FaRulerCombined /> {property.total_area || "0 sqm"}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <FaBed /> {property.bedroom || 2} Bedroom
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <FaShower /> {property.bathroom || 2} Bathroom
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <FaBath /> {property.toilet || 3} Toilet
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Property ID - {property.id || "BLLP-835537"}
          </p>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              What this place offers
            </h2>
            <div className="flex flex-wrap gap-3">
              {offers.map((offer, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full bg-gray-100 py-1 px-2 text-sm"
                >
                  <FaHome className="text-gray-500" />
                  {offer}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 bg-gray-100 rounded-2xl p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Property Description
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {property.description ||
                `2 BED || ₦450M Elegant 2 Bedroom Apartments 📍 Location: VI 💰
                Price: ₦450M Features - Ensuite rooms • Chandelier • Spacious
                living room • Clean water • Top quality tiles • Master’s suite •
                Walk-in shower • Custom vanity • Parking spaces • Secured estate
                • Good access roads • Flood free Title: Deed of assignment
                Completion date: December`}
            </p>
            <button className="text-indigo-600 text-sm font-medium mt-2 hover:underline">
              Read more...
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:w-[320px] flex-shrink-0 space-y-4">
          <div className="bg-gray-100 rounded-2xl text-center shadow p-5 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              ₦{Number(property.price || 0).toLocaleString("en-NG")}
            </h3>
            <p className="text-gray-500 text-sm">
              Property ID - {property.id || "BLLP-835537"}
            </p>

            <div className="mt-4 space-y-3">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium cursor-pointer">
                WhatsApp
              </button>
              <Link href={`/appointments?property_id=${property.id}`}>
                <button className="w-full bg-[#2B2244] hover:bg-[#231B3A] text-white py-2 rounded-lg font-medium cursor-pointer mb-3">
                  Book Inspection
                </button>
              </Link>
              <button className="w-full border border-gray-300 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                Mortgage Calculator
              </button>
            </div>

            <button
              onClick={handleBuy}
              disabled={buying}
              className="bg-[#3A2B66] hover:bg-[#3A2B56] text-white px-6 py-3 mt-5 cursor-pointer rounded-lg font-medium transition"
            >
              {buying ? "Processing..." : "Buy Property"}
            </button>
          </div>
        </aside>
      </section>
      <Footer />
    </main>
  );
}
