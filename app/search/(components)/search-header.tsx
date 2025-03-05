"use client";

import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";

interface SearchHeaderProps {
  category: string;
  location: string;
  query?: string;
}

export function SearchHeader({ category, location, query }: SearchHeaderProps) {
  // Find the current category and location objects
  const currentCategory = CATEGORIES.find((cat) => cat.id === category);
  const currentLocation = LOCATIONS.find((loc) => loc.id === location);

  // Get category icon and color
  const CategoryIcon = currentCategory?.icon;
  const categoryColor = currentCategory?.color || "text-gray-500";

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results</h1>
      <div className="flex flex-col md:flex-row gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="font-semibold">Category:</span>
          {CategoryIcon && (
            <CategoryIcon className={`h-4 w-4 ${categoryColor}`} />
          )}
          <span>
            {currentCategory
              ? currentCategory.title
              : decodeURIComponent(category)}
          </span>
        </div>
        <div className="hidden md:block">•</div>
        <div>
          <span className="font-semibold">Location:</span>{" "}
          {currentLocation
            ? currentLocation.nameEn
            : decodeURIComponent(location)}
        </div>
        {query && (
          <>
            <div className="hidden md:block">•</div>
            <div>
              <span className="font-semibold">Search Query:</span>{" "}
              {decodeURIComponent(query)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
