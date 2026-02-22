"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface Review {
  _id: string;
  product: string;
  name: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const promise = fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to delete");
      return result;
    });

    toast.promise(promise, {
      loading: "Deleting review...",
      success: () => {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        return "Review deleted successfully";
      },
      error: (err) => err.message || "Failed to delete review",
    });

    await promise;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reviews
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage client reviews.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-deep-twilight-300 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Review</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {review.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {review.rating} / 5
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-md truncate">
                      {review.content}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

