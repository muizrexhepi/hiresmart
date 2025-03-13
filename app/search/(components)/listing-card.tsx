"use client";

import { getUserById } from "@/app/actions/users";
import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import type { Listing, Seller } from "@/lib/types";
import { CheckCircle, MapPin, Star, Tag, Gauge, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch seller information
  useEffect(() => {
    const fetchSeller = async () => {
      if (listing.userId) {
        setIsLoading(true);
        try {
          const sellerData = await getUserById(listing.userId);
          setSeller(sellerData);
        } catch (error) {
          console.error("Error fetching seller:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSeller();
  }, [listing.userId]);

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

  // Format product details based on category
  const getProductDetails = () => {
    const isVehicle = listing.category === "vehicles";

    if (isVehicle) {
      return [listing.year, listing.brand, listing.model, listing.condition]
        .filter(Boolean)
        .join(" • ");
    }

    return [listing.condition, listing.brand, listing.model]
      .filter(Boolean)
      .join(" • ");
  };

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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "sold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer bg-white hover:shadow-md transition-all duration-300 relative"
      onClick={handleClick}
    >
      {listing.featured && (
        <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          Featured
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5">
        {/* Image container */}
        <div className="w-full md:w-1/3 h-52 bg-gray-100 rounded-lg overflow-hidden relative">
          {/* Status badge */}
          <div
            className={`absolute bottom-2 left-2 z-10 ${getStatusBadgeColor(
              listing.status
            )} px-3 py-1 rounded-full text-xs font-semibold shadow-sm`}
          >
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </div>

          <img
            src={listing?.images[0] || "/assets/icons/placeholder.svg"}
            alt={listing.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Content container */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Title and verification */}
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl font-bold text-gray-800 hover:text-emerald-700 transition-colors line-clamp-2">
                {listing.title}
              </h3>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-emerald-600 mb-3">
              {listing.price !== null
                ? `$${listing.price.toLocaleString()}`
                : "Contact for price"}
            </div>

            {/* Product details */}
            {getProductDetails() && (
              <div className="text-sm text-gray-600 mb-3">
                {getProductDetails()}
              </div>
            )}

            {/* Vehicle-specific details */}
            {listing.category === "vehicles" && (
              <div className="flex flex-wrap gap-3 mb-3">
                {listing.mileage && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Gauge className="h-4 w-4 text-gray-500" />
                    <span>{listing.mileage} km</span>
                  </div>
                )}

                {listing.gearbox && (
                  <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {listing.gearbox.charAt(0).toUpperCase() +
                      listing.gearbox.slice(1)}
                  </div>
                )}

                {listing.fuel && (
                  <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {listing.fuel}
                  </div>
                )}

                {listing.engineSize && (
                  <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {listing.engineSize}
                  </div>
                )}
              </div>
            )}

            {/* Location and category */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
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
          </div>

          {/* Seller and date info */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            {/* Date info */}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              Listed {formatDate(listing.createdAt)}
            </div>

            {/* Seller info with loading state */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded mt-1 animate-pulse"></div>
                </div>
              </div>
            ) : seller ? (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={seller.image || "/assets/icons/placeholder.svg"}
                    alt={seller.name}
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {seller.name}
                    {seller.verified && (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span>{seller.rating.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span>{seller.totalListings} listings</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Unknown seller</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
