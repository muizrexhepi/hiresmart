"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersSortOptionsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  listingCount: number;
}

export function FiltersSortOptions({
  sortBy,
  onSortChange,
  listingCount,
}: FiltersSortOptionsProps) {
  // Remove local state and use the prop directly
  const handleSortChange = (sort: string) => {
    onSortChange(sort);
  };

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between mr-2 md:mr-0">
        <span className="font-semibold md:font-medium text-sm md:text-base">
          {listingCount} results{" "}
        </span>
        <div className="gap-3 flex-wrap sm:flex-nowrap">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
