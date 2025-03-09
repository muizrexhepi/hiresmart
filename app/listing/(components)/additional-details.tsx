"use client";

import { cn } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string | undefined;
  fullWidth?: boolean;
}

interface AdditionalDetailsProps {
  details: DetailItem[];
}

export function AdditionalDetails({ details }: AdditionalDetailsProps) {
  if (!details.length) return null;

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Additional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col",
              detail.fullWidth ? "md:col-span-2" : "",
              index !== details.length - 1 &&
                "border-b md:border-b-0 pb-4 md:pb-0"
            )}
          >
            <dt className="text-sm text-gray-500 mb-1">{detail.label}</dt>
            <dd className="text-gray-900 font-medium">
              {detail.value || "Not specified"}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}
