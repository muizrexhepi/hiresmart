"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
}

interface SellerReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function SellerReviews({
  reviews,
  averageRating,
  totalReviews,
}: SellerReviewsProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  reviews.forEach((review) => {
    const index = 5 - Math.round(review.rating);
    if (index >= 0 && index < 5) {
      ratingCounts[index]++;
    }
  });

  // Display only 3 reviews initially, show all when expanded
  const displayedReviews = expanded ? reviews : reviews.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-200">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-800 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} reviews</div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating, index) => {
            const count = ratingCounts[5 - rating];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center mb-1">
                <div className="flex items-center w-16">
                  <span className="text-sm text-gray-600 mr-1">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-10 text-right text-xs text-gray-500">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {displayedReviews.length > 0 ? (
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
            >
              <div className="flex items-center mb-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={
                      review.user.image || "/placeholder.svg?height=50&width=50"
                    }
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {review.user.name}
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= Math.round(review.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">No reviews yet</div>
      )}

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors mx-auto"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
