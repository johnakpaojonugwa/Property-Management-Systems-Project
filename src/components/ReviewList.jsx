"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import { LiaSpinnerSolid } from "react-icons/lia";

export default function ReviewList({ propertyId }) {
  const { apiFetch, token, currentUser } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reviews for a property
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(
        `/reviews`,
        "GET",
        null,
        { property_id: propertyId, limit: 10, page: 0 },
        token
      );
      setReviews(data || []);
    } catch (err) {
      console.log("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId && token) fetchReviews();
  }, [propertyId, token]);

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );
  };

  const handleReviewDeleted = (id) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Reviews</h2>

      {/* Create New Review */}
      {currentUser && currentUser.id && (
        <ReviewForm
          propertyId={propertyId}
          onAdded={handleReviewAdded}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <LiaSpinnerSolid className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm mt-3">No reviews yet.</p>
      ) : (
        <div className="space-y-3 mt-3">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onUpdated={handleReviewUpdated}
              onDeleted={handleReviewDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
