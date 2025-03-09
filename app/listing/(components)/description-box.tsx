"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DescriptionBoxProps {
  description: string;
}

export function DescriptionBox({ description }: DescriptionBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        About this item
      </h2>
      <div
        className={cn(
          "prose prose-gray max-w-none",
          "prose-p:text-gray-600 prose-p:leading-relaxed",
          "prose-strong:text-gray-900 prose-strong:font-medium",
          "prose-ul:text-gray-600 prose-li:leading-relaxed",
          !isExpanded && "line-clamp-4"
        )}
      >
        {description}
      </div>
      {description.split("\n").length > 4 && (
        <button
          onClick={toggleDescription}
          className="mt-4 text-primary font-medium flex items-center gap-1 hover:text-primary/90 transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
