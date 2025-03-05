"use client";

import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  resultsCount: number;
}

export function SortOptions({
  sortBy,
  onSortChange,
  resultsCount,
}: SortOptionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4 flex justify-between items-center">
      <div className="text-sm text-gray-600">
        <span>{resultsCount} results found</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 hidden md:inline">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
