"use client";

import { useState, useEffect } from "react";
import { Rating } from "@/lib/types";
import { User, Star } from "lucide-react";
import { getSellerRatings } from "@/app/actions/rating";

interface SellerRatingsProps {
  sellerId: string;
}

export function SellerRatings({ sellerId }: SellerRatingsProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingsSummary, setRatingsSummary] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0], // Count of 1-star, 2-star, etc.
  });

  useEffect(() => {
    async function fetchRatings() {
      try {
        setLoading(true);
        const sellerRatings = await getSellerRatings(sellerId);
        setRatings(sellerRatings);

        // Calculate ratings summary
        if (sellerRatings.length > 0) {
          // Calculate average
          const total = sellerRatings.reduce(
            (sum, rating) => sum + rating.value,
            0
          );
          const average = total / sellerRatings.length;

          // Calculate distribution
          const distribution = [0, 0, 0, 0, 0];
          sellerRatings.forEach((rating) => {
            // Adjust for 0-based array indexing
            const index = Math.min(
              Math.max(Math.floor(rating.value) - 1, 0),
              4
            );
            distribution[index]++;
          });

          setRatingsSummary({
            average,
            total: sellerRatings.length,
            distribution,
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [sellerId]);

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate star rating display
  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= value
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ratings & Reviews
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Loading ratings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          {/* Ratings Summary Section */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {ratingsSummary.average.toFixed(1)}
                </div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(ratingsSummary.average)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {ratingsSummary.total}{" "}
                  {ratingsSummary.total === 1 ? "rating" : "ratings"}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 pl-0 md:pl-6 md:border-l border-gray-200">
                {[5, 4, 3, 2, 1].map((starCount) => (
                  <div key={starCount} className="flex items-center mb-2">
                    <div className="w-14 text-sm text-gray-600 flex items-center">
                      {starCount}{" "}
                      <Star className="h-3 w-3 ml-1 text-gray-400" />
                    </div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden mx-2">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width:
                            ratingsSummary.total > 0
                              ? `${
                                  (ratingsSummary.distribution[starCount - 1] /
                                    ratingsSummary.total) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <div className="w-10 text-xs text-right text-gray-500">
                      {ratingsSummary.distribution[starCount - 1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Ratings */}
          {ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No ratings yet for this seller.
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Customer Reviews
              </h3>
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          User #{rating.raterId.substring(0, 6)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(rating.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(rating.value)}
                      <span className="ml-2 font-medium">
                        {rating.value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700 mt-2">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
