"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";

interface SellerProps {
  id: string;
  name: string;
  image: string;
  memberSince: string;
  verified: boolean;
  rating: number;
  totalListings: number;
  responseRate: string;
  responseTime: string;
}

interface SellerInfoProps {
  seller: SellerProps;
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-bold text-gray-800 mb-3">Seller Information</h3>
      <div className="flex items-center mb-3">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
          <Image
            src={seller.image || "/placeholder.svg"}
            alt={seller.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-medium flex items-center">
            {seller.name}
            {seller.verified && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                <Check className="h-3 w-3 mr-0.5" />
                Verified
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Member since {seller.memberSince}
          </div>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <Star className="h-4 w-4 text-yellow-500 mr-1" />
        <span className="font-medium">{seller.rating}</span>
        <span className="text-gray-500 text-sm ml-1">(32 reviews)</span>
      </div>

      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Response rate:</span>{" "}
        {seller.responseRate}
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Response time:</span>{" "}
        {seller.responseTime}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Total listings:</span>{" "}
        {seller.totalListings}
      </div>

      <Link
        href={`/seller/${seller.id}`}
        className="mt-3 text-emerald-600 font-medium inline-block hover:text-emerald-700"
      >
        View Profile
      </Link>
    </div>
  );
}
