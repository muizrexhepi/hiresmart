import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";

import type { Metadata } from "next";
import CategoryHeader from "../../(components)/category-header";
import FilterSidebar from "../../(components)/filter-sidebar";
import ListingsGrid from "../../(components)/listings-grid";
import { getListingsBySubCategory } from "@/app/actions/listings";

interface SubCategoryPageProps {
  params: {
    categorySlug: string;
    subCategorySlug: string;
  };
  searchParams: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    location?: string;
    page?: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: SubCategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((cat) => cat.id === params.categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const subcategory = category.subCategories.find(
    (sub) => sub.id === params.subCategorySlug
  );

  if (!subcategory) {
    return {
      title: `${category.title} | Marketplace`,
      description: `Browse all ${category.title.toLowerCase()} listings on our marketplace.`,
    };
  }

  return {
    title: `${subcategory.title} - ${category.title} | Marketplace`,
    description: `Browse ${subcategory.title.toLowerCase()} listings in our ${category.title.toLowerCase()} category.`,
  };
}

export default async function SubCategoryPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  // Find the category and subcategory from our constants
  const category = CATEGORIES.find((cat) => cat.id === params.categorySlug);

  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }

  const subcategory = category.subCategories.find(
    (sub) => sub.id === params.subCategorySlug
  );

  // If subcategory doesn't exist, show 404
  if (!subcategory) {
    notFound();
  }

  // Parse search params
  const sort = searchParams.sort || "newest";
  const minPrice = searchParams.minPrice
    ? Number.parseInt(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number.parseInt(searchParams.maxPrice)
    : undefined;
  const location = searchParams.location;
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;

  // Fetch listings for this subcategory
  const listings = await getListingsBySubCategory(
    params.categorySlug,
    params.subCategorySlug
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header with Breadcrumbs */}
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
            { label: category.title, href: `/categories/${category.id}` },
            {
              label: subcategory.title,
              href: `/categories/${category.id}/${subcategory.id}`,
            },
          ]}
        />

        <div className="flex flex-col md:flex-row gap-6 mt-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            location={location}
            sort={sort}
            categorySlug={category.id}
            subCategorySlug={subcategory.id}
          />

          {/* Listings Grid with direct data passing instead of Suspense */}
          <div className="flex-1">
            <ListingsGrid
              listings={listings}
              categoryId={category.id}
              subcategoryId={subcategory.id}
              sort={sort}
              minPrice={minPrice}
              maxPrice={maxPrice}
              location={location}
              page={page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
