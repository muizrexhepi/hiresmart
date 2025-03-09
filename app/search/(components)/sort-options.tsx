"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { Badge } from "@/components/ui/badge";

interface FiltersSortOptionsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultsCount: number;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedLocation?: string;
}

export function FiltersSortOptions({
  sortBy,
  onSortChange,
  resultsCount,
  selectedCategory = "all",
  selectedSubcategory = "",
  selectedLocation = "all",
}: FiltersSortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize with props values or fallback to searchParams
  const [currentCategory, setCurrentCategory] = useState(
    selectedCategory || searchParams.get("category") || "all"
  );
  const [currentSubcategory, setCurrentSubcategory] = useState(
    selectedSubcategory || searchParams.get("subcategory") || ""
  );
  const [currentLocation, setCurrentLocation] = useState(
    selectedLocation || searchParams.get("location") || "all"
  );

  // Count active filters
  const activeFilterCount = [
    currentCategory !== "all" ? 1 : 0,
    currentSubcategory ? 1 : 0,
    currentLocation !== "all" ? 1 : 0,
  ].reduce((sum, val) => sum + val, 0);

  // Get subcategories for selected category
  const categoryObj = CATEGORIES.find((cat) => cat.id === currentCategory);
  const subcategories = categoryObj?.subCategories || [];

  // Update state when props change
  useEffect(() => {
    if (selectedCategory) setCurrentCategory(selectedCategory);
    if (selectedSubcategory) setCurrentSubcategory(selectedSubcategory);
    if (selectedLocation) setCurrentLocation(selectedLocation);
  }, [selectedCategory, selectedSubcategory, selectedLocation]);

  // Handlers
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentSubcategory("");
    applyFilters(category, "", currentLocation, sortBy);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setCurrentSubcategory(subcategory);
    applyFilters(currentCategory, subcategory, currentLocation, sortBy);
  };

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    applyFilters(currentCategory, currentSubcategory, location, sortBy);
  };

  const handleClearFilters = () => {
    setCurrentCategory("all");
    setCurrentSubcategory("");
    setCurrentLocation("all");
    router.push("/search/all/all");
  };

  const applyFilters = (
    category: string,
    subcategory: string,
    location: string,
    sort: string
  ) => {
    const params = new URLSearchParams();

    if (subcategory) params.append("subcategory", subcategory);
    if (sort && sort !== "newest") params.append("sort", sort);

    router.push(`/search/${category}/${location}?${params.toString()}`);
  };

  return (
    <div className="w-full mb-6">
      {/* Mobile filters with horizontal scroll */}
      <div className="mb-4 md:hidden">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-600">
            <span className="font-semibold text-black">{resultsCount}</span>{" "}
            listings available
          </p>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {/* Category */}
            <Select
              value={currentCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <Select
                value={currentSubcategory}
                onValueChange={handleSubcategoryChange}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Location */}
            <Select
              value={currentLocation}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value) => {
                onSortChange(value);
                applyFilters(
                  currentCategory,
                  currentSubcategory,
                  currentLocation,
                  value
                );
              }}
            >
              <SelectTrigger className="w-[140px]">
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
        </div>
      </div>

      {/* Desktop filters and sort */}
      <div className="hidden md:flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 flex-wrap sm:flex-nowrap">
          {/* Category */}
          <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="max-w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {subcategories.length > 0 && (
            <Select
              value={currentSubcategory}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger className="max-w-[200px]">
                <SelectValue placeholder="All Subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat.id} value={subcat.id}>
                    {subcat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Location */}
          <Select value={currentLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="max-w-[200px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              onSortChange(value);
              applyFilters(
                currentCategory,
                currentSubcategory,
                currentLocation,
                value
              );
            }}
          >
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

      {/* Clear filters button for desktop */}
      {activeFilterCount > 0 && (
        <div className="hidden md:flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
