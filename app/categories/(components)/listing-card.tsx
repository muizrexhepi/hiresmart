"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/lib/types";
import { format } from "date-fns";

interface ListingCardProps {
  listing: Listing;
}

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function ListingCard({ listing }: ListingCardProps) {
  const slug = generateSlug(listing.title);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/listing/${listing.$id}/${slug}`}>
        <Card className="overflow-hidden h-full">
          <div className="relative h-48">
            <img
              src={
                listing?.images.length > 0
                  ? listing.images[0]
                  : "/assets/icons/placeholder.svg"
              }
              alt={listing.title}
              className="object-cover h-full w-full"
            />
            {listing.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                Featured
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
              {listing.title}
            </h3>

            <div className="text-lg font-bold text-gray-900 mb-2">
              {listing.price !== null
                ? `$${listing.price.toLocaleString()}`
                : "Contact for price"}
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
              <div className="flex items-center capitalize">
                <MapPin className="h-3 w-3 mr-1" />
                {listing.location}
              </div>
              <div className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs capitalize`}
                >
                  {listing.category}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Listed {format(listing.createdAt, "MMMM yyyy")}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
