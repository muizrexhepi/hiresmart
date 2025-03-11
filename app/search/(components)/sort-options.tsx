"use client";

import React, { useState } from "react";
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
  resultsCount: number;
}

export function FiltersSortOptions({
  sortBy,
  onSortChange,
  resultsCount,
}: FiltersSortOptionsProps) {
  const searchParams = useSearchParams();

  const [currentSort, setCurrentSort] = useState(
    sortBy || searchParams.get("sort") || "newest"
  );

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    onSortChange(sort);
  };

  return (
    <div className="w-full mb-6">
      <div className="hidden md:flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap">
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px] border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-gray-600 whitespace-nowrap">
          <span className="font-semibold text-black">{resultsCount}</span>{" "}
          listings
        </p>
      </div>
    </div>
  );
}
