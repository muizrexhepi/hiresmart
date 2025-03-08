"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
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
                {item.featured && (
                  <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Featured
                  </div>
                )}
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
                <div className="mt-auto flex items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span>{item?.seller?.rating || 5.0}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>{item?.createdAt}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
