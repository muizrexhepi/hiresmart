"use client";

import React from "react";
import { CATEGORIES } from "@/constants/categories";
import { LOCATIONS } from "@/constants/locations";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceRangeSlider } from "./price-range-filter";

export const CONDITIONS = [
  { id: "new", label: "New" },
  { id: "like-new", label: "Used - Like New" },
  { id: "good", label: "Used - Good" },
  { id: "fair", label: "Used - Fair" },
  { id: "poor", label: "Used - Poor" },
];

interface FilterFormProps {
  isMobile?: boolean;
  currentCategory: string;
  currentSubcategory: string;
  currentLocation: string;
  localPriceRange: {
    min: string | number;
    max: string | number;
  };
  selectedConditions: string[];
  activeFilterCount: number;
  categoryObj: any;
  handleCategoryChange: (category: string) => void;
  handleSubcategoryChange: (subcategory: string) => void;
  handleLocationChange: (location: string) => void;
  handlePriceRangeChange: (min: number, max: number) => void;
  toggleCondition: (conditionId: string) => void;
  handleApplyFilters: (e: React.FormEvent) => void;
  handleClearFilters: () => void;
  formRef: React.RefObject<HTMLFormElement>;
}

export function FilterForm({
  isMobile = false,
  currentCategory,
  currentSubcategory,
  currentLocation,
  localPriceRange,
  selectedConditions,
  activeFilterCount,
  categoryObj,
  handleCategoryChange,
  handleSubcategoryChange,
  handleLocationChange,
  handlePriceRangeChange,
  toggleCondition,
  handleApplyFilters,
  handleClearFilters,
  formRef,
}: FilterFormProps) {
  return (
    <form
      ref={formRef}
      onSubmit={handleApplyFilters}
      className="space-y-6 bg-background rounded-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="font-semibold bg-emerald-100 text-[#023020]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && !isMobile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-[#023020] hover:text-[#034530] hover:bg-emerald-50"
          >
            Clear all
          </Button>
        )}
      </div>

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
            className="w-full border-gray-300 focus:ring-[#023020] focus:border-[#023020]"
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
            className="w-full border-gray-300 focus:ring-[#023020] focus:border-[#023020]"
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

      {/* Subcategory filter - only show if category is selected and has subcategories */}
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
                  className="w-full border-gray-300 focus:ring-[#023020] focus:border-[#023020]"
                >
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {categoryObj.subCategories.map((subcat: any) => (
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

      {/* Price range filter - using PriceRangeSlider component */}
      <PriceRangeSlider
        minPrice={localPriceRange.min}
        maxPrice={localPriceRange.max}
        absoluteMin={0}
        absoluteMax={99999}
        onPriceChange={handlePriceRangeChange}
      />

      <Separator className="my-4 bg-gray-200" />

      {/* Condition filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <Label className="text-sm font-medium">Condition</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {CONDITIONS.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition.id}-${
                  isMobile ? "mobile" : "desktop"
                }`}
                checked={selectedConditions.includes(condition.id)}
                onCheckedChange={() => toggleCondition(condition.id)}
                className="text-[#023020] focus:ring-[#034530]"
              />
              <Label
                htmlFor={`condition-${condition.id}-${
                  isMobile ? "mobile" : "desktop"
                }`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {condition.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4 bg-gray-200" />

      {/* Apply filters button */}
      <div className="pt-2 flex flex-col gap-2">
        <Button
          type="submit"
          className="w-full bg-[#023020] hover:bg-[#034530] text-white"
          variant="default"
        >
          Apply Filters
        </Button>

        {activeFilterCount > 0 && isMobile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </form>
  );
}
