"use client";

import { MapPin, Tag, Clock } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ListingHeaderProps {
  title: string;
  category: string;
  subcategory?: string;
  location: string;
  date: string;
  featured?: boolean;
}

export function ListingHeader({
  title,
  category,
  subcategory,
  location,
  date,
  featured,
}: ListingHeaderProps) {
  // Find category and location info
  const listingCategory = CATEGORIES.find((cat) => cat.id === category);
  const listingSubcategory = listingCategory?.subCategories.find(
    (sub) => sub.id === subcategory
  );
  const listingLocation = LOCATIONS.find((loc) => loc.id === location);

  // Get category color
  const categoryColor = listingCategory?.color || "text-gray-500";
  const router = useRouter();

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search results
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {title}
          </h1>
          {featured && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-md text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-sm">
            <Tag className="h-4 w-4 text-emerald-600" />
            <span
              className={`px-2 py-1 ${categoryColor
                .replace("text-", "bg-")
                .replace("500", "100")} ${categoryColor} rounded-full text-xs`}
            >
              {listingCategory?.title || category}
            </span>
            {listingSubcategory && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {listingSubcategory.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-600">
              {listingLocation?.nameEn || location}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-gray-600">Listed {date}</span>
          </div>
        </div>
      </div>
    </>
  );
}
