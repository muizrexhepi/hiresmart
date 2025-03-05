"use client";

import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function FiltersSidebar({ showFilters }: { showFilters: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCategory, setCurrentCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [currentLocation, setCurrentLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });

  const categoryObj = CATEGORIES.find((cat) => cat.id === currentCategory);

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleCategoryChange = (category: string) => {
    console.log({ category });
    setCurrentCategory(category);
  };

  const handleLocationChange = (location: string) => {
    console.log({ location });
    setCurrentLocation(location);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams = new URLSearchParams();

    if (priceRange.min) {
      searchParams.append("minPrice", priceRange.min);
    }
    if (priceRange.max) {
      searchParams.append("maxPrice", priceRange.max);
    }

    if (categoryObj && categoryObj.subCategories.length > 0) {
      searchParams.append("subcategory", categoryObj.subCategories[0].id);
    }

    router.push(
      `/search/${currentCategory}/${currentLocation}?${searchParams.toString()}`
    );
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit ${
        showFilters
          ? "fixed inset-0 z-50 md:relative md:inset-auto"
          : "hidden md:block"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          onClick={() => router.push("/")}
          className="md:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Category</h4>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Location filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Location</h4>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={currentLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="all">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory filter */}
      {categoryObj && categoryObj.subCategories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Subcategory</h4>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => handlePriceRangeChange("min", e.target.value)}
          >
            <option value="">All Subcategories</option>
            {categoryObj.subCategories.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price range filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange("min", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange("max", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Apply filters button */}
      <button
        onClick={handleApplyFilters}
        className="w-full py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors"
      >
        Apply Filters
      </button>
    </motion.aside>
  );
}
