"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag } from "lucide-react";
import { LOCATIONS } from "@/constants/locations";
import { CATEGORIES } from "@/constants/categories";
import { Listing } from "@/lib/types";

interface SellerListingsProps {
  listings: Listing[];
  sellerId: string;
}

export function SellerListings({ listings, sellerId }: SellerListingsProps) {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  console.log({ listings });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Listings by this Seller
      </h2>

      {listings.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {listings.map((listing) => {
            const listingCategory = CATEGORIES.find(
              (cat) => cat.id === listing.category
            );
            const listingLocation = LOCATIONS.find(
              (loc) => loc.id === listing.location
            );

            return (
              <motion.div key={listing.$id} variants={itemVariants}>
                <Link
                  href={`/listing/${listing.$id}/${listing.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <img
                        src={
                          listing.images.length > 0
                            ? listing.images[0]
                            : "/assets/icons/placeholder.svg?height=200&width=300"
                        }
                        alt={listing.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="text-lg font-bold text-emerald-600 mb-2">
                        $
                        {listing.price ? listing.price.toLocaleString() : "N/A"}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listingLocation?.nameEn || listing.location}
                        </div>
                        {listingCategory && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span
                              className={`px-1.5 py-0.5 ${listingCategory.color
                                .replace("text-", "bg-")
                                .replace("500", "100")} ${
                                listingCategory.color
                              } rounded-full text-xs`}
                            >
                              {listingCategory.title}
                            </span>
                          </div>
                        )}
                        {listing.status !== "active" && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                            {listing.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-2">
            No listings available from this seller yet.
          </p>
          <p className="text-sm text-gray-400">
            Check back later for new listings.
          </p>
        </div>
      )}
    </div>
  );
}
