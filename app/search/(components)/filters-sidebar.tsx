"use client";

import type React from "react";

import { CATEGORIES } from "@/constants/categories";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FilterForm } from "./filter-form";

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
  className: string;
}

export function FiltersSidebar({
  selectedCategory = "all",
  selectedSubcategory = "",
  onSubcategoryChange,
  priceRange: externalPriceRange,
  onPriceRangeChange,
  selectedLocation = "all",
  className,
}: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

  // Get conditions from URL params if they exist
  const initialConditions = searchParams.get("conditions")?.split(",") || [];
  const [selectedConditions, setSelectedConditions] =
    useState<string[]>(initialConditions);

  // Count active filters
  const activeFilterCount = [
    currentCategory !== "all" ? 1 : 0,
    currentSubcategory ? 1 : 0,
    currentLocation !== "all" ? 1 : 0,
    localPriceRange.min ? 1 : 0,
    localPriceRange.max ? 1 : 0,
    selectedConditions.length > 0 ? 1 : 0,
  ].reduce((sum, val) => sum + val, 0);

  // Toggle condition selection
  const toggleCondition = (conditionId: string) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  // Update internal state when props change
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

    if (externalPriceRange) {
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

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    // Reset subcategory when category changes
    setCurrentSubcategory("");
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: string) => {
    setCurrentSubcategory(subcategory);
    // If external handler is provided, use it
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
  };

  // Handle price range change from slider
  const handlePriceRangeChange = (min: number, max: number) => {
    setLocalPriceRange({
      min: min,
      max: max,
    });
  };

  // Apply filters
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    // Update external price range handler if it exists
    if (onPriceRangeChange) {
      onPriceRangeChange("min", localPriceRange.min.toString());
      onPriceRangeChange("max", localPriceRange.max.toString());
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
    if (selectedConditions.length > 0) {
      params.append("conditions", selectedConditions.join(","));
    }

    router.push(
      `/search/${currentCategory}/${currentLocation}?${params.toString()}`
    );

    // Close the sheet on mobile after applying filters
    setIsOpen(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setCurrentCategory("all");
    setCurrentSubcategory("");
    setCurrentLocation("all");
    setLocalPriceRange({ min: "", max: "" });
    setSelectedConditions([]);

    // Only update external state on explicit actions like clear
    if (onPriceRangeChange) {
      onPriceRangeChange("min", "");
      onPriceRangeChange("max", "");
    }

    router.push("/search/all/all");
    setIsOpen(false);
  };

  return (
    <div className={cn("", className)}>
      {/* Mobile Filters (Sheet) */}
      <div className="block md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
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
          <SheetContent side="right" className="w-[90%] sm:max-w-md p-4 pt-8">
            <FilterForm
              isMobile={true}
              currentCategory={currentCategory}
              currentSubcategory={currentSubcategory}
              currentLocation={currentLocation}
              localPriceRange={localPriceRange}
              selectedConditions={selectedConditions}
              activeFilterCount={activeFilterCount}
              categoryObj={categoryObj}
              handleCategoryChange={handleCategoryChange}
              handleSubcategoryChange={handleSubcategoryChange}
              handleLocationChange={handleLocationChange}
              handlePriceRangeChange={handlePriceRangeChange}
              toggleCondition={toggleCondition}
              handleApplyFilters={handleApplyFilters}
              handleClearFilters={handleClearFilters}
              formRef={formRef}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters (Always visible) */}
      <div className="hidden md:block w-64 h-fit">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <FilterForm
              currentCategory={currentCategory}
              currentSubcategory={currentSubcategory}
              currentLocation={currentLocation}
              localPriceRange={localPriceRange}
              selectedConditions={selectedConditions}
              activeFilterCount={activeFilterCount}
              categoryObj={categoryObj}
              handleCategoryChange={handleCategoryChange}
              handleSubcategoryChange={handleSubcategoryChange}
              handleLocationChange={handleLocationChange}
              handlePriceRangeChange={handlePriceRangeChange}
              toggleCondition={toggleCondition}
              handleApplyFilters={handleApplyFilters}
              handleClearFilters={handleClearFilters}
              formRef={formRef}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
