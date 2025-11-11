"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { LiaSpinnerSolid } from "react-icons/lia";
import {
  MdOutlineTitle,
  MdOutlinePriceChange,
  MdOutlineDescription,
  MdOutlineLocationCity,
  MdOutlineApartment,
  MdOutlineHome,
  MdOutlineTerrain,
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlinePublic,
  MdOutlineMap,
} from "react-icons/md";

export default function CreateProperty() {
  const { token, user, getAllAgents, BASE_URL } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    country: "NIGERIA",
    state: "ABUJA",
    city: "",
    lat: "34.27822",
    lng: "-118.3455",
    address: "",
    description: "",
    category: "FLAT",
    total_area: "",
    property_use: "RESIDENTIAL",
    payment_plan: "PER_ANNUM",
    type: "RENT",
    bedroom: "",
    bathroom: "",
    toilet: "3",
    parking_space: "4",
    furnishing: "FURNISHED",
    disclaimer: "Insured by ABC Insurance Co.",
    amenities: "Gym, Swimming Pool, 24/7 Security",
  });

  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const loadAgents = async () => {
      if (user?.role === "MERCHANT") {
        const result = await getAllAgents();
        setAgents(result || []);
      }
    };
    loadAgents();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please login first");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedroom: Number(formData.bedroom),
        bathroom: Number(formData.bathroom),
        toilet: Number(formData.toilet),
        parking_space: Number(formData.parking_space),
        amenities: formData.amenities.split(",").map((a) => a.trim()),
        merchant: user?.merchant || "",
        agent: formData.agent || user?.agent?._id,
      };

      const res = await axios.post(`${BASE_URL}/properties`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Property created successfully!");
      setTimeout(() => {
        router.push("/dashboard/agent/properties");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-[#2b2340] text-center">
        Create Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Property Name */}
        <div className="relative">
          <MdOutlineTitle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Property Name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
            required
          />
        </div>

        {/* Price */}
        <div className="relative">
          <MdOutlinePriceChange className="absolute left-3 top-3 text-gray-400" />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (₦)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
            required
          />
        </div>

        {/* Country */}
        <div className="relative">
          <MdOutlinePublic className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* State */}
        <div className="relative">
          <MdOutlineMap className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* City */}
        <div className="relative">
          <MdOutlineLocationCity className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Address */}
        <div className="relative">
          <MdOutlineHome className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <MdOutlineApartment className="absolute left-3 top-3 text-gray-400" />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-amber-900 outline-none"
          >
            <option value="FLAT">Flat</option>
            <option value="APARTMENT">Apartment</option>
            <option value="LAND">Land</option>
            <option value="DUPLEX">Duplex</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="SHOP">Shop</option>
          </select>
        </div>

        {/* Total Area */}
        <div className="relative">
          <MdOutlineTerrain className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="total_area"
            value={formData.total_area}
            onChange={handleChange}
            placeholder="Total Area"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <MdOutlineBed className="absolute left-3 top-3 text-gray-400" />
          <input
            type="number"
            name="bedroom"
            value={formData.bedroom}
            onChange={handleChange}
            placeholder="Bedrooms"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Bathrooms */}
        <div className="relative">
          <MdOutlineBathtub className="absolute left-3 top-3 text-gray-400" />
          <input
            type="number"
            name="bathroom"
            value={formData.bathroom}
            onChange={handleChange}
            placeholder="Bathrooms"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Merchant Only: Select Agent */}
        {user?.role === "MERCHANT" && (
          <div className="md:col-span-2 relative">
            <select
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-amber-900 outline-none"
            >
              <option value="">Select Agent</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.full_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div className="relative md:col-span-2">
          <MdOutlineDescription className="absolute left-3 top-3 text-gray-400" />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`md:col-span-2 w-full text-center text-white py-2 rounded-md transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-800 hover:bg-teal-600"
          }`}
        >
          {loading ? (
            <>
              <LiaSpinnerSolid className="animate-spin text-lg" /> Creating...
            </>
          ) : (
            <>Create Property</>
          )}
        </button>
      </form>
    </div>
  );
}
