"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function ReviewItem({ review, onUpdated, onDeleted }) {
  const { apiFetch, token, currentUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.text);
  const [loading, setLoading] = useState(false);

  const isOwner = review.user_id === currentUser?.id;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updated = await apiFetch(
        `/reviews/${review._id}`,
        "PUT",
        { text },
        {},
        token
      );
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error updating review:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    try {
      await apiFetch(`/reviews/${review._id}`, "DELETE", null, {}, token);
      onDeleted(review._id);
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="border border-gray-100 rounded-md p-3 shadow-sm">
      {editing ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-200 rounded-md p-2 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded-md"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-600 px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-700">{review.text}</p>
          <div className="text-xs text-gray-400 mt-1">
            by {review.user?.first_name || "Anonymous"}
          </div>

          {isOwner && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 text-xs"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
