"use client";

import type React from "react";

import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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

  // Use external price range if provided, otherwise initialize from searchParams
  const [internalPriceRange, setInternalPriceRange] = useState({
    min: externalPriceRange?.min || searchParams.get("minPrice") || "",
    max: externalPriceRange?.max || searchParams.get("maxPrice") || "",
  });

  // Determine which price range to use
  const priceRange = externalPriceRange || internalPriceRange;

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
  }, [selectedCategory, selectedSubcategory, selectedLocation]);

  const categoryObj = CATEGORIES.find((cat) => cat.id === currentCategory);

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    // If external handler is provided, use it
    if (onPriceRangeChange) {
      onPriceRangeChange(type, value);
    } else {
      // Otherwise, update internal state
      setInternalPriceRange((prev) => ({ ...prev, [type]: value }));
    }
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

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (priceRange.min) {
      params.append("minPrice", priceRange.min.toString());
    }
    if (priceRange.max) {
      params.append("maxPrice", priceRange.max.toString());
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

  // Shared filter form component to avoid duplication
  const FilterForm = ({ isMobile = false }) => (
    <form onSubmit={handleApplyFilters} className="space-y-6">
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <SheetClose asChild>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      )}

      {!isMobile && (
        <div className="mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
        </div>
      )}

      {/* Category filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="w-full">
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

      <Separator />

      {/* Location filter */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={currentLocation} onValueChange={handleLocationChange}>
          <SelectTrigger id="location" className="w-full">
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

      <Separator />

      {/* Subcategory filter */}
      {categoryObj && categoryObj.subCategories.length > 0 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select
              value={currentSubcategory}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger id="subcategory" className="w-full">
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
          <Separator />
        </>
      )}

      {/* Price range filter */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex gap-2 items-center">
          <div className="w-full">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange("min", e.target.value)}
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="w-full">
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange("max", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Apply filters button */}
      {isMobile ? (
        <SheetClose asChild>
          <Button type="submit" className="w-full" variant="default">
            Apply Filters
          </Button>
        </SheetClose>
      ) : (
        <Button type="submit" className="w-full" variant="default">
          Apply Filters
        </Button>
      )}
    </form>
  );

  return (
    <>
      {/* Mobile Filters (Sheet) */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-4 pt-8">
            <FilterForm isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters (Always visible) */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:block w-64 h-fit sticky top-4"
      >
        <Card>
          <CardContent className="p-4">
            <FilterForm />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
