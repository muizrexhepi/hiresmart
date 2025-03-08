"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Check,
  MessageCircle,
  Heart,
  Share2,
} from "lucide-react";
import { LOCATIONS } from "@/constants/locations";
import { Seller } from "@/lib/types";

interface SellerProfileHeaderProps {
  seller: Seller;
  onContact: () => void;
  onFollow: () => void;
  onShare: () => void;
}

export function SellerProfileHeader({
  seller,
  onContact,
  onFollow,
  onShare,
}: SellerProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow();
  };
  console.log({ seller });

  const location = LOCATIONS.find((loc) => loc.id === seller.location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Profile Image */}
        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow">
          <img
            src={
              seller.image ||
              "/assets/icons/placeholder.svg?height=200&width=200"
            }
            alt={seller.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Seller Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {seller.name}
            </h1>
            {seller.verified && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Verified Seller
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{location?.nameEn || seller.location}</span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(seller.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{seller.rating.toFixed(1)}</span>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>Member since {seller.memberSince}</p>
            <p>
              Response rate: {seller.responseRate} • Response time:{" "}
              {seller.responseTime}
            </p>
            <p>Total listings: {seller.totalListings}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button
            onClick={onContact}
            className="w-full md:w-auto bg-emerald-600 text-white py-2 px-4 rounded-md font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Seller
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleFollow}
              className={`flex-1 py-2 px-3 rounded-md font-medium flex items-center justify-center transition-colors ${
                isFollowing
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart
                className={`mr-1 h-4 w-4 ${isFollowing ? "fill-gray-800" : ""}`}
              />
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button
              onClick={onShare}
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      {seller.bio && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-600">{seller.bio}</p>
        </div>
      )}
    </motion.div>
  );
}
