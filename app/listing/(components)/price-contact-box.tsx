"use client";

import { MessageCircle, Phone, Heart, Share2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Seller } from "@/lib/types";

interface PriceContactBoxProps {
  price: number | null;
  seller: Seller;
  onMessage: () => void;
  onCall: () => void;
  onSave: () => void;
  onShare: () => void;
}

export function PriceContactBox({
  price,
  seller,
  onMessage,
  onCall,
  onSave,
  onShare,
}: PriceContactBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="text-3xl font-bold text-emerald-600 mb-4">
        {price !== null ? `$${price.toLocaleString()}` : "Contact for price"}
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
          onClick={onSave}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Heart className="mr-1 h-5 w-5" />
          Save
        </button>
        <button
          onClick={onShare}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Share2 className="mr-1 h-5 w-5" />
          Share
        </button>
      </div>

      {/* Seller information */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">Seller Information</h3>
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={seller.image || "/placeholder.svg?height=48&width=48"}
              alt={seller.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{seller.name}</span>
              {seller.verified && (
                <span className="ml-2 text-emerald-600 flex items-center text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Member since {seller.memberSince}
            </div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-amber-500 mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(seller.rating)
                        ? "fill-current"
                        : "fill-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-gray-600">
                  {seller.rating}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {seller.totalListings} listings
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
              <div>Response rate: {seller.responseRate}</div>
              <div>Response time: {seller.responseTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
