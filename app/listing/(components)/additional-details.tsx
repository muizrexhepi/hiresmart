"use client";

import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/types";

interface DetailItem {
  label: string;
  value: string | undefined;
  fullWidth?: boolean;
}

interface AdditionalDetailsProps {
  listing: Listing;
}

export function AdditionalDetails({ listing }: AdditionalDetailsProps) {
  // Determine if this is a vehicle listing
  const isVehicle = listing.category.includes(listing.category);

  // Build details array based on listing type
  let details: DetailItem[] = [];

  // Base details (for all listings)
  if (listing.condition)
    details.push({ label: "Condition", value: listing.condition });
  if (listing.brand) details.push({ label: "Brand", value: listing.brand });
  if (listing.model) details.push({ label: "Model", value: listing.model });
  if (listing.year) details.push({ label: "Year", value: listing.year });
  if (listing.warranty)
    details.push({
      label: "Warranty",
      value: listing.warranty,
      fullWidth: true,
    });

  // Vehicle-specific details
  if (isVehicle) {
    if (listing.mileage)
      details.push({ label: "Mileage", value: listing.mileage });
    if (listing.gearbox)
      details.push({ label: "Gearbox/Transmission", value: listing.gearbox });
    if (listing.fuel) details.push({ label: "Fuel Type", value: listing.fuel });
    if (listing.engineSize)
      details.push({ label: "Engine Size", value: listing.engineSize });
    if (listing.color) details.push({ label: "Color", value: listing.color });
    if (listing.doors) details.push({ label: "Doors", value: listing.doors });
    if (listing.seats) details.push({ label: "Seats", value: listing.seats });
    if (listing.driveType)
      details.push({ label: "Drive Type", value: listing.driveType });
    if (listing.bodyType)
      details.push({ label: "Body Type", value: listing.bodyType });

    // Features as a full-width item if present
    if (listing.features)
      details.push({
        label: "Features",
        value: listing.features,
        fullWidth: true,
      });
  }

  if (!details.length) return null;

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isVehicle ? "Vehicle Details" : "Additional Details"}
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
