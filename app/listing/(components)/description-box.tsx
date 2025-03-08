"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DescriptionBoxProps {
  description: string;
}

export function DescriptionBox({ description }: DescriptionBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
      <div
        className={`text-gray-600 whitespace-pre-line ${
          !isExpanded && "line-clamp-4"
        }`}
      >
        {description}
      </div>
      {description.split("\n").length > 4 && (
        <button
          onClick={toggleDescription}
          className="mt-2 text-emerald-600 font-medium flex items-center hover:text-emerald-700"
        >
          {isExpanded ? (
            <>
              Read Less <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
