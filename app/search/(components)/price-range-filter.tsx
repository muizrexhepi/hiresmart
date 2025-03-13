"use client";

import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriceRangeSliderProps {
  minPrice: number | string;
  maxPrice: number | string;
  absoluteMin?: number;
  absoluteMax?: number;
  onPriceChange: (min: number, max: number) => void;
}

export function PriceRangeSlider({
  minPrice,
  maxPrice,
  absoluteMin = 0,
  absoluteMax = 10000,
  onPriceChange,
}: PriceRangeSliderProps) {
  // Convert string inputs to numbers with fallbacks
  const parsedMin =
    typeof minPrice === "string"
      ? parseFloat(minPrice) || absoluteMin
      : minPrice || absoluteMin;
  const parsedMax =
    typeof maxPrice === "string"
      ? parseFloat(maxPrice) || absoluteMax
      : maxPrice || absoluteMax;

  // Local state for slider and input values
  const [values, setValues] = useState<[number, number]>([
    parsedMin,
    parsedMax,
  ]);
  const [inputValues, setInputValues] = useState({
    min: parsedMin.toString(),
    max: parsedMax.toString(),
  });

  // When props change, update local state
  useEffect(() => {
    const newMin =
      typeof minPrice === "string"
        ? parseFloat(minPrice) || absoluteMin
        : minPrice || absoluteMin;
    const newMax =
      typeof maxPrice === "string"
        ? parseFloat(maxPrice) || absoluteMax
        : maxPrice || absoluteMax;

    setValues([newMin, newMax]);
    setInputValues({
      min: newMin.toString(),
      max: newMax.toString(),
    });
  }, [minPrice, maxPrice, absoluteMin, absoluteMax]);

  // Handle slider change
  const handleSliderChange = (newValues: number[]) => {
    setValues([newValues[0], newValues[1]]);
    setInputValues({
      min: newValues[0].toString(),
      max: newValues[1].toString(),
    });
    onPriceChange(newValues[0], newValues[1]);
  };

  // Handle input blur to update slider
  const handleInputBlur = (type: "min" | "max") => {
    let min = parseFloat(inputValues.min) || absoluteMin;
    let max = parseFloat(inputValues.max) || absoluteMax;

    // Ensure min <= max
    if (type === "min" && min > max) {
      min = max;
      setInputValues((prev) => ({ ...prev, min: min.toString() }));
    } else if (type === "max" && max < min) {
      max = min;
      setInputValues((prev) => ({ ...prev, max: max.toString() }));
    }

    // Update slider and notify parent
    setValues([min, max]);
    onPriceChange(min, max);
  };

  // Handle input change without immediately triggering updates
  const handleInputChange = (type: "min" | "max", value: string) => {
    setInputValues((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Price Range</Label>

      <div className="pt-2 px-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={values}
          min={absoluteMin}
          max={absoluteMax}
          step={1}
          onValueChange={handleSliderChange}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-[#023020] rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#023020] focus:ring-offset-2"
            aria-label="Min price"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#023020] focus:ring-offset-2"
            aria-label="Max price"
          />
        </Slider.Root>
      </div>

      <div className="flex gap-2 items-center">
        <div className="w-full">
          <Input
            type="number"
            placeholder="Min"
            value={inputValues.min}
            onChange={(e) => handleInputChange("min", e.target.value)}
            onBlur={() => handleInputBlur("min")}
            className="w-full border-gray-300 focus:ring-[#023020] focus:border-[#023020]"
          />
        </div>
        <span className="text-gray-500">-</span>
        <div className="w-full">
          <Input
            type="number"
            placeholder="Max"
            value={inputValues.max}
            onChange={(e) => handleInputChange("max", e.target.value)}
            onBlur={() => handleInputBlur("max")}
            className="w-full border-gray-300 focus:ring-[#023020] focus:border-[#023020]"
          />
        </div>
      </div>
    </div>
  );
}
