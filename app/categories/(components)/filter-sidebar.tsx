"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LOCATIONS } from "@/constants/locations";

interface FilterSidebarProps {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: string;
  categorySlug: string;
  subCategorySlug?: string;
}

export default function FilterSidebar({
  minPrice = 0,
  maxPrice = 10000,
  location,
  sort = "newest",
  categorySlug,
  subCategorySlug,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 10000,
  ]);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    location || ""
  );
  const [selectedSort, setSelectedSort] = useState<string>(sort || "newest");

  // Update state when props change
  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 10000]);
    setSelectedLocation(location || "");
    setSelectedSort(sort || "newest");
  }, [minPrice, maxPrice, location, sort]);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedSort !== "newest") {
      params.set("sort", selectedSort);
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < 10000) {
      params.set("maxPrice", priceRange[1].toString());
    }

    if (selectedLocation && selectedLocation !== "all") {
      params.set("location", selectedLocation);
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);

    // Close mobile filter on apply
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedLocation("");
    setSelectedSort("newest");
    router.push(pathname);
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter sidebar - desktop always visible, mobile as overlay */}
      <motion.div
        className={`
          bg-white rounded-lg shadow-sm p-5 h-fit
          ${
            isOpen
              ? "fixed inset-0 z-50 overflow-auto md:relative md:inset-auto md:w-72 md:z-0"
              : "hidden md:block md:w-72"
          }
        `}
        initial={{ x: isOpen ? -300 : 0, opacity: isOpen ? 0 : 1 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sort by */}
        <div className="mb-6">
          <Label htmlFor="sort" className="block mb-2">
            Sort by
          </Label>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <Label className="block mb-2">Price Range</Label>
          <div className="mb-6">
            <Slider
              value={priceRange}
              min={0}
              max={10000}
              step={100}
              onValueChange={(value: any) =>
                setPriceRange(value as [number, number])
              }
              className="my-6"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="min-price" className="sr-only">
                Min Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="min-price"
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                  className="pl-7"
                />
              </div>
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex-1">
              <Label htmlFor="max-price" className="sr-only">
                Max Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="max-price"
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 10000,
                    ])
                  }
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label htmlFor="location" className="block mb-2">
            Location
          </Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </motion.div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
