"use client";

import type { Listing } from "@/lib/types";
import { ListingCard } from "./listing-card";

interface ListingsGridProps {
  listings: Listing[];
}

export function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.$id} listing={listing} />
      ))}
    </div>
  );
}
