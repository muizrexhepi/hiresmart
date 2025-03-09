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
    <div className="space-y-4 bg-transparent overflow-hidden">
      <AnimatePresence>
        {listings.map((listing) => (
          <ListingCard key={listing.$id} listing={listing} />
        ))}
      </AnimatePresence>
    </div>
  );
}
