"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import {
  FaBed,
  FaShower,
  FaRulerCombined,
  FaHome,
  FaBath,
} from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function PropertyPage() {
  const { id } = useParams();
  const { BASE_URL, agentToken } = useApp();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${BASE_URL}/properties/${id}`, {
          headers: { Authorization: `Bearer ${agentToken}` },
        });
        const data = await res.json();
        setProperty(data);

        const firstImage =
          data.image && data.image.startsWith("http")
            ? data.image
            : data.image
            ? `${BASE_URL}/uploads/${data.image}`
            : "/placeholder.jpg";

        setMainImage(firstImage);
      } catch (err) {
        console.log("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, BASE_URL, agentToken]);

  useEffect(() => {
  console.log("BASE_URL:", BASE_URL);
  console.log("agentToken:", agentToken);
  console.log("Params:", id);
}, [BASE_URL, agentToken, id]);


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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LiaSpinnerSolid size={50} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Property not found or could not be loaded.
      </p>
    );
  }

  const thumbnails = Array.isArray(property.images) ? property.images : [];

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <header className="bg-white rounded-2xl p-8 mb-10 border border-gray-100">
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
      <div className="lg:col-span-2 max-w-7xl mb-10">
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
      <section className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-2xl border border-gray-100">
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
          <div className="bg-gray-100 rounded-2xl shadow p-5 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900">
              ₦{Number(property.price || 0).toLocaleString("en-NG")}
            </h3>
            <p className="text-gray-500 text-sm">
              Property ID - {property.id || "BLLP-835537"}
            </p>

            <div className="mt-4 space-y-3">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium">
                WhatsApp
              </button>
              <button className="w-full bg-[#2B2244] hover:bg-[#231B3A] text-white py-2 rounded-lg font-medium">
                Book Inspection
              </button>
              <button className="w-full border border-gray-300 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                Mortgage Calculator
              </button>
            </div>

            <div className="border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm text-center py-3 mt-4">
              BuyLetLive Guarantee <br />
              <span className="text-gray-600">
                This property is verified and backed by our diaspora buyer
                protection.
              </span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
