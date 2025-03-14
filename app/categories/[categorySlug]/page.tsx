import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";

import { Metadata } from "next";
import CategoryHeader from "../(components)/category-header";
import ListingsSkeleton from "../(components)/listings-skeleton";
import SubcategoryGrid from "../(components)/subcategory-header";
import ListingsGrid from "../(components)/listings-grid";
import FilterSidebar from "../(components)/filter-sidebar";
import {
  getFilteredListings,
  getListingsByCategory,
} from "@/app/actions/listings";

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
  searchParams: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    location?: string;
    page?: string;
    subcategory?: string;
    conditions?: string;
    q?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((cat) => cat.id === params.categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.title} | Marketplace`,
    description: `Browse all ${category.title.toLowerCase()} listings on our marketplace.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // Find the category from our constants
  const category = CATEGORIES.find((cat) => cat.id === params.categorySlug);

  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }

  // Parse search params
  const sort = searchParams.sort || "newest";
  const minPrice = searchParams.minPrice
    ? parseInt(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? parseInt(searchParams.maxPrice)
    : undefined;
  const location = searchParams.location;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const subcategory = searchParams.subcategory;
  const conditions = searchParams.conditions;
  const searchQuery = searchParams.q || "";

  // Fetch filtered listings
  const { listings, totalPages } = await getFilteredListings({
    categoryId: params.categorySlug,
    subcategoryId: subcategory,
    location,
    minPrice,
    maxPrice,
    conditions,
    page,
    limit: 10,
    sortBy: sort,
    searchQuery: searchQuery, // Adding the required searchQuery parameter
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <CategoryHeader
          category={{
            id: category.id,
            title: category.title,
            iconName: category.iconName,
            color: category.color,
            titleMk: category.titleMk,
          }}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: category.title, href: `/category/${category.id}` },
          ]}
        />

        {/* Subcategories Grid */}
        <SubcategoryGrid
          category={{
            id: category.id,
            subCategories: category.subCategories.map((sub) => ({
              id: sub.id,
              title: sub.title,
            })),
          }}
          className="mb-8"
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            location={location}
            sort={sort}
            categorySlug={category.id}
          />

          {/* Listings Grid with direct data passing */}
          <div className="flex-1">
            <ListingsGrid
              listings={listings}
              categoryId={category.id}
              sort={sort}
              minPrice={minPrice}
              maxPrice={maxPrice}
              location={location}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
