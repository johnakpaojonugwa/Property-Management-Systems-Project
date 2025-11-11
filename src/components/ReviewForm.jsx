"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ReviewForm({ propertyId, onAdded }) {
  const { apiFetch, token, currentUser } = useApp();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const body = {
        property_id: propertyId,
        user_id: currentUser?.id,
        text,
      };
      const data = await apiFetch("/reviews", "POST", body, {}, token);
      onAdded(data);
      setText("");
    } catch (err) {
      console.error("Error creating review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review..."
        className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}
