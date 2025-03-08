"use client";

import { Listing } from "@/lib/types";
import { AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ListingCard } from "./listing-card";

interface ListingsGridProps {
  listings: Listing[];
  onLoadMore: () => void;
}

export function ListingsGrid({ listings, onLoadMore }: ListingsGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <AnimatePresence>
        {listings.map((listing) => (
          <ListingCard key={listing.$id} listing={listing} />
        ))}
      </AnimatePresence>

      {/* Load more button */}
      <div className="p-4 text-center">
        <button
          onClick={onLoadMore}
          className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Load More
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
