"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { getUserRatingForSeller, rateUser } from "@/app/actions/rating";

interface RateSellerProps {
  sellerId: string;
  onRatingSubmit?: (newRating: number) => void;
}

export function RateSeller({ sellerId, onRatingSubmit }: RateSellerProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Check if the user has already rated this seller
  useEffect(() => {
    const checkUserRating = async () => {
      if (!user) return;

      try {
        const userRating = await getUserRatingForSeller(sellerId, user.$id);
        if (userRating) {
          setRating(userRating.value);
          setComment(userRating.comment || "");
          setHasRated(true);
        }
      } catch (error) {
        console.error("Error checking user rating:", error);
      }
    };

    checkUserRating();
  }, [sellerId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast("Please sign in", {
        description: "You need to be signed in to rate sellers",
      });
      return;
    }

    if (rating === 0) {
      toast("Select a rating", {
        description: "Please select a star rating before submitting",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await rateUser(sellerId, user.$id, rating, comment);

      toast("Rating submitted", {
        description: hasRated
          ? "Your rating has been updated"
          : "Thank you for rating this seller",
      });

      setHasRated(true);
      setShowRatingForm(false);

      // Call the callback with the new rating
      if (onRatingSubmit) {
        onRatingSubmit(rating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast("Rating failed", {
        description: "There was an error submitting your rating",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-gray-600">Sign in to rate this seller</p>
        {/* You could add a sign-in button here */}
      </div>
    );
  }

  if (user.$id === sellerId) {
    return null; // Don't show rating option for own profile
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {hasRated ? "Your Rating" : "Rate This Seller"}
      </h3>

      {!showRatingForm && hasRated ? (
        <div>
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-700">{rating} out of 5</span>
          </div>

          {comment && (
            <div className="mb-4">
              <p className="text-gray-700">{comment}</p>
            </div>
          )}

          <Button variant="outline" onClick={() => setShowRatingForm(true)}>
            Edit Your Rating
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-700">
              {hoverRating || rating || "Select"} out of 5
            </span>
          </div>

          <div className="mb-4">
            <Textarea
              placeholder="Share your experience with this seller (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting
                ? "Submitting..."
                : hasRated
                ? "Update Rating"
                : "Submit Rating"}
            </Button>

            {showRatingForm && hasRated && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRatingForm(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
