"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { toast } from "react-toastify";
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
  MdOutlineMap
} from "react-icons/md";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { agentToken, BASE_URL } = useApp();

  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch single property
  const fetchProperty = async () => {
    if (!id || !agentToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        headers: { Authorization: `Bearer ${agentToken}` },
      });
      const data = await res.json();
      setProperty(data?.data || {});
      setForm(data?.data || {});
    } catch (err) {
      toast.error("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Update property
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!agentToken) return toast.error("Missing agentToken");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${agentToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Property updated successfully");
        router.push("/dashboard/agent/properties");
      } else {
        toast.error(data?.msg || "Failed to update property");
      }
    } catch {
      toast.error("Error updating property");
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handlePreviewImages = (files) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Upload images
  const handleUploadImages = async () => {
    if (images.length === 0) return toast.error("Select images first");

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${BASE_URL}/properties/${id}/resource`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${agentToken}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Images uploaded successfully");
        setImages([]);
        setPreviewImages([]);
        fetchProperty();
      } else {
        toast.error(data?.msg || "Failed to upload images");
      }
    } catch {
      toast.error("Error uploading images");
    }
  };

  if (loading && !property) {
    return (
      <div className="flex justify-center items-center py-20">
        <LiaSpinnerSolid size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h1 className="text-2xl font-semibold mb-6 text-[#2b2340]">Edit Property</h1>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="relative">
          <MdOutlineTitle className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Property Name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Price */}
        <div className="relative">
          <MdOutlinePriceChange className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            placeholder="Price (₦)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Country */}
        <div className="relative">
          <MdOutlinePublic className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="country"
            value={form.country || ""}
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
            value={form.state || ""}
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
            value={form.city || ""}
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
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <MdOutlineApartment className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            placeholder="Category (e.g. FLAT)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Total Area */}
        <div className="relative">
          <MdOutlineTerrain className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="total_area"
            value={form.total_area || ""}
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
            value={form.bedroom || ""}
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
            value={form.bathroom || ""}
            onChange={handleChange}
            placeholder="Bathrooms"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
          />
        </div>

        {/* Description */}
        <div className="relative md:col-span-2">
          <MdOutlineDescription className="absolute left-3 top-3 text-gray-400" />
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-900 outline-none"
            rows={4}
          />
        </div>

        {/* Update Button */}
        <button
          type="submit"
          disabled={loading}
          className={`md:col-span-2 w-full text-center text-white py-2 rounded-md transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-800 hover:bg-teal-600"
          }`}
        >
          {loading ? (
            <>
              <LiaSpinnerSolid className="animate-spin text-lg" /> Updating...
            </>
          ) : (
            <>Update Property</>
          )}
        </button>
      </form>

      {/* Image Upload Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">Upload Images</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handlePreviewImages(e.target.files)}
          className="hidden"
          ref={fileInputRef}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-all duration-300"
        >
          Add Images
        </button>

        <button
          onClick={handleUploadImages}
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300"
        >
          Upload Images
        </button>

        {/* Preview Selected Images */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {previewImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  alt={`Preview ${i}`}
                  className="w-full h-40 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
                    setImages((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Already uploaded images */}
        {property?.images?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {property.images.map((img, i) => (
              <img
                key={i}
                src={img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`}
                alt={`Property ${i}`}
                className="w-full h-40 object-cover rounded-md border"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
