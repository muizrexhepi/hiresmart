"use client";

import type React from "react";

import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface FiltersSidebarProps {
  selectedCategory: string;
  selectedSubcategory?: string;
  onSubcategoryChange?: (subcategory: string) => void;
  priceRange?: {
    min: string | number;
    max: string | number;
  };
  onPriceRangeChange?: (type: "min" | "max", value: string) => void;
  selectedLocation: string;
}

export function FiltersSidebar({
  selectedCategory = "all",
  selectedSubcategory = "",
  onSubcategoryChange,
  priceRange: externalPriceRange,
  onPriceRangeChange,
  selectedLocation = "all",
}: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // References for price inputs to maintain focus
  const minPriceInputRef = useRef<HTMLInputElement>(null);
  const maxPriceInputRef = useRef<HTMLInputElement>(null);

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

  // Store local price range values that won't trigger refetching
  const [localPriceRange, setLocalPriceRange] = useState({
    min: externalPriceRange?.min || searchParams.get("minPrice") || "",
    max: externalPriceRange?.max || searchParams.get("maxPrice") || "",
  });

  // Count active filters
  const activeFilterCount = [
    currentCategory !== "all" ? 1 : 0,
    currentSubcategory ? 1 : 0,
    currentLocation !== "all" ? 1 : 0,
    localPriceRange.min ? 1 : 0,
    localPriceRange.max ? 1 : 0,
  ].reduce((sum, val) => sum + val, 0);

  // Update internal state when props change, but don't update price range during typing
  useEffect(() => {
    if (selectedCategory) {
      setCurrentCategory(selectedCategory);
    }
    if (selectedSubcategory) {
      setCurrentSubcategory(selectedSubcategory);
    }
    if (selectedLocation) {
      setCurrentLocation(selectedLocation);
    }

    // Only update price range from props during initialization or when not focused
    const minInputIsFocused =
      document.activeElement === minPriceInputRef.current;
    const maxInputIsFocused =
      document.activeElement === maxPriceInputRef.current;

    if (externalPriceRange && !minInputIsFocused && !maxInputIsFocused) {
      setLocalPriceRange({
        min: externalPriceRange.min,
        max: externalPriceRange.max,
      });
    }
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedLocation,
    externalPriceRange,
  ]);

  const categoryObj = CATEGORIES.find((cat) => cat.id === currentCategory);

  // Handle price range input changes locally without calling any external handlers
  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    setLocalPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    // Reset subcategory when category changes
    setCurrentSubcategory("");
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setCurrentSubcategory(subcategory);
    // If external handler is provided, use it
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }
  };

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
  };

  // Only apply price range changes when form is submitted
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    // Now update the external price range handler if it exists
    if (onPriceRangeChange) {
      if (
        localPriceRange.min.toString() !==
        (externalPriceRange?.min || "").toString()
      ) {
        onPriceRangeChange("min", localPriceRange.min.toString());
      }
      if (
        localPriceRange.max.toString() !==
        (externalPriceRange?.max || "").toString()
      ) {
        onPriceRangeChange("max", localPriceRange.max.toString());
      }
    }

    const params = new URLSearchParams();

    if (localPriceRange.min) {
      params.append("minPrice", localPriceRange.min.toString());
    }
    if (localPriceRange.max) {
      params.append("maxPrice", localPriceRange.max.toString());
    }
    if (currentSubcategory) {
      params.append("subcategory", currentSubcategory);
    }

    router.push(
      `/search/${currentCategory}/${currentLocation}?${params.toString()}`
    );

    // Close the sheet on mobile after applying filters
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setCurrentCategory("all");
    setCurrentSubcategory("");
    setCurrentLocation("all");
    setLocalPriceRange({ min: "", max: "" });

    // Only update external state on explicit actions like clear
    if (onPriceRangeChange) {
      onPriceRangeChange("min", "");
      onPriceRangeChange("max", "");
    }

    router.push("/search/all/all");
    setIsOpen(false);
  };

  // Shared filter form component to avoid duplication
  const FilterForm = ({ isMobile = false }) => (
    <form ref={formRef} onSubmit={handleApplyFilters} className="space-y-6">
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="font-semibold bg-emerald-100 text-emerald-700"
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="font-semibold bg-emerald-100 text-emerald-700"
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Category filter */}
      <div className="space-y-2">
        <Label
          htmlFor={`category-${isMobile ? "mobile" : "desktop"}`}
          className="text-sm font-medium"
        >
          Category
        </Label>
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger
            id={`category-${isMobile ? "mobile" : "desktop"}`}
            className="w-full border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <SelectValue placeholder="Select category" />
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
      </div>

      <Separator className="my-4 bg-gray-200" />

      {/* Location filter */}
      <div className="space-y-2">
        <Label
          htmlFor={`location-${isMobile ? "mobile" : "desktop"}`}
          className="text-sm font-medium"
        >
          Location
        </Label>
        <Select value={currentLocation} onValueChange={handleLocationChange}>
          <SelectTrigger
            id={`location-${isMobile ? "mobile" : "desktop"}`}
            className="w-full border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <SelectValue placeholder="Select location" />
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
      </div>

      <Separator className="my-4 bg-gray-200" />

      {/* Subcategory filter */}
      {categoryObj &&
        categoryObj.subCategories &&
        categoryObj.subCategories.length > 0 && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor={`subcategory-${isMobile ? "mobile" : "desktop"}`}
                className="text-sm font-medium"
              >
                Subcategory
              </Label>
              <Select
                value={currentSubcategory}
                onValueChange={handleSubcategoryChange}
              >
                <SelectTrigger
                  id={`subcategory-${isMobile ? "mobile" : "desktop"}`}
                  className="w-full border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {categoryObj.subCategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator className="my-4 bg-gray-200" />
          </>
        )}

      {/* Price range filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="flex gap-2 items-center">
          <div className="w-full">
            <Input
              ref={minPriceInputRef}
              type="number"
              placeholder="Min"
              value={localPriceRange.min}
              onChange={(e) => handlePriceRangeChange("min", e.target.value)}
              className="w-full border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="w-full">
            <Input
              ref={maxPriceInputRef}
              type="number"
              placeholder="Max"
              value={localPriceRange.max}
              onChange={(e) => handlePriceRangeChange("max", e.target.value)}
              className="w-full border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Apply filters button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          variant="default"
        >
          Apply Filters
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {/* Mobile Filters (Sheet) */}
      <div className="block md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1 font-semibold bg-emerald-100 text-emerald-700"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[90%] sm:max-w-md p-4 pt-8">
            <FilterForm isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters (Always visible) */}
      <div className="hidden md:block w-64 h-fit">
        <Card className=" border-gray-200">
          <CardContent className="p-4">
            <FilterForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
