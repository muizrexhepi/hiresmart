"use client";

import {
  MessageCircle,
  Phone,
  Heart,
  Share2,
  CheckCircle,
  Loader2,
  ExternalLink,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Seller } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getSellerRatings } from "@/app/actions/rating";
import { isListingSaved, toggleSavedListing } from "@/app/actions/saved";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface PriceContactBoxProps {
  price: number | null;
  listingId: string; // Add listing ID
  seller?: Seller;
  onMessage: () => void;
  onCall: () => void;
  onShare: () => void;
}

export function PriceContactBox({
  price,
  listingId,
  seller,
  onMessage,
  onCall,
  onShare,
}: PriceContactBoxProps) {
  const [ratingsSummary, setRatingsSummary] = useState({
    average: 0,
    total: 0,
  });
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRatingSummary() {
      if (!seller) return;

      try {
        setIsLoadingRatings(true);
        const ratings = await getSellerRatings(seller.id);

        if (ratings.length > 0) {
          const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
          const average = total / ratings.length;

          setRatingsSummary({
            average,
            total: ratings.length,
          });
        }
      } catch (error) {
        console.error("Error fetching ratings summary:", error);
      } finally {
        setIsLoadingRatings(false);
      }
    }

    async function checkSavedStatus() {
      if (!user || !listingId) {
        setIsCheckingSaved(false);
        return;
      }

      try {
        setIsCheckingSaved(true);
        const saved = await isListingSaved(listingId, user.$id);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsCheckingSaved(false);
      }
    }

    fetchRatingSummary();
    checkSavedStatus();
  }, [seller, listingId, user]);

  const handleSave = async () => {
    if (!user) {
      toast("Login Required", {
        description: "Please log in to save listings",
      });
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);
      const isNowSaved = await toggleSavedListing(listingId, user.$id);
      setIsSaved(isNowSaved);

      toast(isNowSaved ? "Listing Saved" : "Listing Removed", {
        description: isNowSaved
          ? "This listing has been added to your saved items"
          : "This listing has been removed from your saved items",
      });
    } catch (error) {
      console.error("Error saving listing:", error);
      toast("Error", {
        description: "Could not save listing. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="text-3xl font-bold text-emerald-600 mb-4">
        {price !== 0 ? `$${price?.toLocaleString()}` : "Contact for price"}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={onMessage}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Message Seller
        </button>
        <button
          onClick={onCall}
          className="w-full bg-white border border-emerald-600 text-emerald-600 py-3 px-4 rounded-md font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center"
        >
          <Phone className="mr-2 h-5 w-5" />
          Call Seller
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={handleSave}
          disabled={isCheckingSaved || isSaving}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isCheckingSaved ? (
            <Loader2 className="mr-1 h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`mr-1 h-5 w-5 ${
                isSaved ? "fill-red-500 text-red-500" : ""
              }`}
            />
          )}
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          onClick={onShare}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Share2 className="mr-1 h-5 w-5" />
          Share
        </button>
      </div>

      {seller ? (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Seller Information</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-0"
              asChild
            >
              <Link
                href={`/seller/${seller.id}`}
                className="flex items-center gap-1 text-xs"
              >
                View Seller
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="flex items-start gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={seller?.image || "/placeholder.svg?height=48&width=48"}
                alt={seller?.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium">{seller?.name}</span>
                {seller?.verified && (
                  <span className="ml-2 text-emerald-600 flex items-center text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Member since {format(new Date(seller.memberSince), "MMMM yyyy")}
              </div>

              {/* Ratings display */}
              <div className="mt-2">
                {isLoadingRatings ? (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="animate-pulse w-16 h-3 bg-gray-200 rounded mr-2"></div>
                    Loading ratings...
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= Math.round(ratingsSummary.average)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">
                      {ratingsSummary.average.toFixed(1)}
                    </span>
                    {ratingsSummary.total > 0 && (
                      <span className="text-xs text-gray-500">
                        ({ratingsSummary.total}{" "}
                        {ratingsSummary.total === 1 ? "rating" : "ratings"})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                <div>Response rate: {seller.responseRate}</div>
                <div>Response time: {seller.responseTime}</div>
                <div className="col-span-2">
                  Total listings: {seller.totalListings}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}
