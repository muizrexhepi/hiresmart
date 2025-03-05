"use server";
import { CATEGORIES } from "@/constants/categories";
import { mockListings } from "@/lib/data";
import { ListingsParams, ListingsResponse } from "@/lib/types";

export async function fetchListings({
  categoryId,
  subcategoryId,
  sort = "newest",
  minPrice,
  maxPrice,
  location,
  page = 1,
}: ListingsParams): Promise<ListingsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the category from our constants
  const categoryInfo = CATEGORIES.find((cat) => cat.id === categoryId);

  // Filter listings based on category
  let filteredListings = [...mockListings];

  // Map category IDs to display names for filtering
  const categoryMap: Record<string, string> = {
    vehicles: "Vehicles",
    "real-estate": "Real Estate",
    electronics: "Electronics",
    "home-garden": "Home & Garden",
    sports: "Sports",
    services: "Services",
    jobs: "Jobs",
    tools: "Tools & Machinery",
  };

  // Map subcategory IDs to display names for filtering
  const subcategoryMap: Record<string, Record<string, string>> = {
    vehicles: {
      cars: "Cars",
      motorcycles: "Motorcycles",
      trucks: "Trucks",
      bicycles: "Bicycles",
      parts: "Parts & Accessories",
    },
    "real-estate": {
      apartments: "Apartments",
      houses: "Houses",
      land: "Land",
      commercial: "Commercial",
    },
    electronics: {
      phones: "Phones",
      laptops: "Laptops",
      cameras: "Cameras",
      audio: "Audio",
    },
    // Add other subcategories as needed
  };

  // Filter by category
  if (categoryId !== "all") {
    const categoryName = categoryMap[categoryId];
    filteredListings = filteredListings.filter(
      (listing) => listing.category === categoryName
    );
  }

  // Filter by subcategory if provided
  if (subcategoryId && categoryId !== "all") {
    const subcategoryName = subcategoryMap[categoryId]?.[subcategoryId];
    if (subcategoryName) {
      filteredListings = filteredListings.filter(
        (listing) => listing.subcategory === subcategoryName
      );
    }
  }

  // Filter by price range
  if (minPrice !== undefined) {
    filteredListings = filteredListings.filter(
      (listing) => listing.price === null || listing.price >= minPrice
    );
  }

  if (maxPrice !== undefined) {
    filteredListings = filteredListings.filter(
      (listing) => listing.price === null || listing.price <= maxPrice
    );
  }

  // Filter by location
  if (location) {
    filteredListings = filteredListings.filter((listing) =>
      listing.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Sort listings
  switch (sort) {
    case "price_low":
      filteredListings.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      });
      break;
    case "price_high":
      filteredListings.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      });
      break;
    case "popular":
      // For demo purposes, we'll just prioritize featured listings
      filteredListings.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      break;
    case "newest":
    default:
      // Already sorted by newest in our mock data
      break;
  }

  // Calculate pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  return {
    listings: paginatedListings,
    totalPages,
  };
}
