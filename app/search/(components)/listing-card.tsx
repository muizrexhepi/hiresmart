"use client";

import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import type { Listing } from "@/lib/types";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Star, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();
  console.log({ listing });
  // Generate SEO-friendly slug
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleClick = () => {
    const slug = generateSlug(listing.title);
    router.push(`/listing/${listing.$id}/${slug}`);
  };

  // Find category and location info
  const listingCategory = CATEGORIES.find((cat) => cat.id === listing.category);
  const listingSubcategory = listingCategory?.subCategories.find(
    (sub) => sub.id === listing.subcategory
  );
  const listingLocation = LOCATIONS.find((loc) => loc.id === listing.location);

  // Format product details (condition, brand, year)
  const productDetails = [listing.condition, listing.brand, listing.year]
    .filter(Boolean)
    .join(" | ");

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-white"
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 h-48 bg-gray-100 rounded-md overflow-hidden relative">
          {listing.featured && (
            <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Featured
            </div>
          )}
          <Image
            src={listing?.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={listing.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
            priority={listing.featured}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-emerald-700 transition-colors">
              {listing.title}
            </h3>
            {/* Seller verification badge */}
            {listing.seller?.verified && (
              <span className="text-emerald-600 flex items-center text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified
              </span>
            )}
          </div>

          <div className="text-2xl font-bold text-emerald-600 mb-3">
            {listing.price !== null
              ? `$${listing.price.toLocaleString()}`
              : "Contact for price"}
          </div>

          {productDetails && (
            <div className="text-sm text-gray-600 mb-3">{productDetails}</div>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listingLocation ? listingLocation.nameEn : listing.location}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                {listingCategory ? listingCategory.title : listing.category}
              </span>
              {listingSubcategory && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {listingSubcategory.title}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-400">
              Listed {formatDate(listing.createdAt)}
            </div>

            {/* Seller info */}
            {listing.seller && (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={
                      listing.seller.image ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt={listing.seller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {listing.seller.name}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    {listing.seller.rating} • {listing.seller.totalListings}{" "}
                    listings
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
