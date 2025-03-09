"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Tag, Clock } from "lucide-react";
import { LOCATIONS } from "@/constants/locations";
import type { Listing } from "@/lib/types";

interface RelatedListingsProps {
  listings: Listing[];
}

export function RelatedListings({ listings }: RelatedListingsProps) {
  if (!listings.length) return null;

  // Generate SEO-friendly slug
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "Today";
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    } catch (e) {
      return dateString;
    }
  };

  // Status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "sold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((item) => (
          <Link
            href={`/listing/${item.$id}/${generateSlug(item.title)}`}
            key={item.$id}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="relative h-48 w-full">
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                  {item.featured && (
                    <div className="bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>
                <Image
                  src={
                    item?.images[0] || "/placeholder.svg?height=200&width=300"
                  }
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <div className="text-lg font-bold text-emerald-600 mb-2">
                  {item.price !== null
                    ? `$${item.price.toLocaleString()}`
                    : "Contact for price"}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {LOCATIONS.find((loc) => loc.id === item.location)?.nameEn ||
                    item.location}
                </div>

                {item.category && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="text-xs">
                      {item.category}
                      {item.subcategory ? ` › ${item.subcategory}` : ""}
                    </span>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span>{item?.seller?.rating || 5.0}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
