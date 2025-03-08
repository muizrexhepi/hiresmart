"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/lib/types";
import { getFeaturedListings, getUserListings } from "@/app/actions/listings";

interface FeaturedListingsProps {
  userId?: string; // Optional: If provided, will show user's listings instead of featured
  limit?: number;
}

export function FeaturedListings({ userId, limit = 4 }: FeaturedListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);

        let fetchedListings: Listing[];

        if (userId) {
          // If userId is provided, fetch that user's listings
          fetchedListings = await getUserListings(userId);
        } else {
          // Otherwise fetch featured listings
          fetchedListings = await getFeaturedListings();
        }

        // Limit the number of listings to display
        setListings(fetchedListings.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error("Error loading listings:", err);
        setError("Failed to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [userId, limit]);

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mk-MK", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const title = userId ? "User Listings" : "Featured Listings";
  const viewAllLink = userId ? `/seller/${userId}` : "/listings";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif">{title}</h2>
          <Link href={viewAllLink}>
            <Button variant="ghost" className="gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No listings found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Card key={listing.$id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={
                        listing.images?.[0] ||
                        "/placeholder.svg?height=200&width=300"
                      }
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-1">
                      {listing.title}
                    </h3>
                    <span className="text-green-600 font-semibold whitespace-nowrap">
                      {listing.price
                        ? formatPrice(listing?.price)
                        : "Contact for price"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </div>
                  {listing.category && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {listing.category}
                      </span>
                      {listing.subcategory && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-1">
                          {listing.subcategory}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link
                    href={`/listing/${listing.$id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    View details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
