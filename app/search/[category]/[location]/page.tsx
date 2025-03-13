"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FiltersSidebar } from "../../(components)/filters-sidebar";
import { FiltersSortOptions } from "../../(components)/sort-options";
import { LoadingState } from "../../(components)/loading-state";
import { ErrorState } from "../../(components)/error-state";
import { EmptyState } from "../../(components)/empty-state";
import { ListingsGrid } from "../../(components)/listing-grid";
import { Pagination } from "../../(components)/pagination";
import { Listing } from "@/lib/types";
import { getFilteredListings, getAllListings } from "@/app/actions/listings";
import { motion } from "framer-motion";

const SearchPage = ({
  params,
}: {
  params: { category: string; location: string };
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = searchParams.get("q") || "";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const subcategoryParam = searchParams.get("subcategory") || "";
  const conditionsParam = searchParams.get("conditions") || "";
  const pageParam = searchParams.get("page");
  const sortParam = searchParams.get("sort");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam ? parseInt(minPriceParam) : "",
    max: maxPriceParam ? parseInt(maxPriceParam) : "",
  });
  const [sortBy, setSortBy] = useState(sortParam || "newest");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(subcategoryParam);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedConditions, setSelectedConditions] = useState(
    conditionsParam ? conditionsParam.split(",") : []
  );
  // Handle price range changes
  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  // Handle subcategory changes
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);

    // Update URL with new subcategory
    const params = new URLSearchParams(searchParams.toString());
    if (subcategory) {
      params.set("subcategory", subcategory);
    } else {
      params.delete("subcategory");
    }

    // Reset to page 1 when filter changes
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  // Update state when URL params change
  useEffect(() => {
    if (minPriceParam) {
      setPriceRange((prev) => ({ ...prev, min: parseInt(minPriceParam) }));
    } else {
      setPriceRange((prev) => ({ ...prev, min: "" }));
    }

    if (maxPriceParam) {
      setPriceRange((prev) => ({ ...prev, max: parseInt(maxPriceParam) }));
    } else {
      setPriceRange((prev) => ({ ...prev, max: "" }));
    }

    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    } else {
      setSelectedSubcategory("");
    }
    if (conditionsParam) {
      setSelectedConditions(conditionsParam.split(","));
    } else {
      setSelectedConditions([]);
    }
    if (pageParam) {
      setPage(parseInt(pageParam));
    } else {
      setPage(1);
    }

    if (sortParam) {
      setSortBy(sortParam);
    } else {
      setSortBy("newest");
    }

    // Update searchQuery when URL query parameter changes
    setSearchQuery(query || "");
  }, [
    minPriceParam,
    maxPriceParam,
    subcategoryParam,
    query,
    pageParam,
    sortParam,
    conditionsParam,
  ]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Get all filter values directly from URL params
      const query = searchParams.get("q") || "";
      const subcategory = searchParams.get("subcategory") || "";
      const minPrice = searchParams.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined;
      const maxPrice = searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined;
      const conditions = searchParams.get("conditions") || "";
      const currentPage = searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1;
      const sort = searchParams.get("sort") || "newest";

      let result: { listings: Listing[]; totalPages: number };

      // Check if we need to show all listings with no filters
      if (
        (params.category === "all" || !params.category) &&
        (params.location === "all" || !params.location) &&
        !subcategory &&
        !minPrice &&
        !maxPrice &&
        conditions.length === 0 &&
        !query
      ) {
        console.log("Fetching all listings");
        result = await getAllListings(currentPage, 10);
      } else {
        // Apply filters with or without search query
        console.log("Fetching filtered listings with params:");
        console.log({
          category: params.category,
          location: params.location,
          subcategory,
          minPrice,
          maxPrice,
          conditions,
          sort,
          query,
        });

        result = await getFilteredListings({
          categoryId: params.category !== "all" ? params.category : undefined,
          subcategoryId: subcategory,
          location: params.location !== "all" ? params.location : undefined,
          minPrice: minPrice,
          maxPrice: maxPrice,
          conditions: conditions,
          page: currentPage,
          limit: 10,
          sortBy: sort,
          searchQuery: query,
        });
      }

      setListings(result.listings);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.listings.length);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, params.category, params.location]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSortChange = (value: string) => {
    // Only update the URL, don't update local state
    const params = new URLSearchParams(searchParams.toString());

    if (value !== "newest") {
      params.set("sort", value);
    } else {
      params.delete("sort"); // Remove sort param if it's the default "newest"
    }

    // Reset to page 1 when sorting changes
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);

    // The useEffect that depends on searchParams will trigger the fetchListings
  };

  const handleRetry = () => {
    fetchListings();
  };

  const handlePageChange = (newPage: number) => {
    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);

    // The component will re-render with the new page from URL params
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 !pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar Filters */}
          <FiltersSidebar
            className="hidden md:block"
            selectedCategory={params.category}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            selectedConditions={selectedConditions}
            onConditionsChange={setSelectedConditions}
            selectedLocation={params.location}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results Header */}
            {query && !loading ? (
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Search results for &quot;{query}&quot;
                </h1>
                <p className="text-gray-500">
                  Found {totalCount} listing{totalCount !== 1 ? "s" : ""}
                </p>
              </div>
            ) : null}

            {/* Sort options */}
            {!loading && !error && listings.length > 0 && (
              <div className="flex">
                <FiltersSortOptions
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  listingCount={listings.length}
                />
                <FiltersSidebar
                  selectedCategory={params.category}
                  selectedSubcategory={selectedSubcategory}
                  onSubcategoryChange={handleSubcategoryChange}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  selectedConditions={selectedConditions}
                  onConditionsChange={setSelectedConditions}
                  selectedLocation={params.location}
                  className="md:hidden"
                />
              </div>
            )}

            {loading && <LoadingState />}

            {!loading && error && (
              <ErrorState error={error} onRetry={handleRetry} />
            )}

            {!loading && !error && listings.length === 0 && <EmptyState />}

            {!loading && !error && listings.length > 0 && (
              <>
                <div>
                  <ListingsGrid listings={listings} />
                </div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-8"
                >
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
