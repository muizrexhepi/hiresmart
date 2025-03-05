"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SearchHeader } from "../../(components)/search-header";
import { SearchBar } from "../../(components)/search-bar";
import { FiltersSidebar } from "../../(components)/filters-sidebar";
import { SortOptions } from "../../(components)/sort-options";
import { LoadingState } from "../../(components)/loading-state";
import { ErrorState } from "../../(components)/error-state";
import { EmptyState } from "../../(components)/empty-state";
import { ListingsGrid } from "../../(components)/listing-grid";
import { Listing, ListingsResponse } from "@/lib/types";

const SearchPage = ({
  params,
}: {
  params: { category: string; location: string };
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const paramsObj = {
        category: params.category || "all",
        location: params.location || "all",
        q: query,
        minPrice: priceRange.min.toString(),
        maxPrice: priceRange.max.toString(),
        subcategory: selectedSubcategory || "",
        sort: sortBy,
        page: page.toString(),
      };

      const paramsString = new URLSearchParams(paramsObj).toString();
      const response = await fetch(`/api/search`);

      if (!response.ok) throw new Error("Failed to fetch listings");

      const data: ListingsResponse = await response.json();
      console.log({ data });
      setListings((prevListings) =>
        page === 1 ? data.listings : [...prevListings, ...data.listings]
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    params.category,
    params.location,
    query,
    priceRange,
    selectedSubcategory,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (newQuery: string) => {
    setPage(1);
    fetchListings();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleRetry = () => {
    fetchListings();
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <SearchBar
          defaultQuery={query}
          onSearch={handleSearch}
          toggleFilters={toggleFilters}
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile unless toggled */}
          <AnimatePresence>
            {showFilters && <FiltersSidebar showFilters={showFilters} />}
          </AnimatePresence>

          {/* Results section */}
          <div className="flex-1">
            {/* Sort options */}
            {!loading && !error && listings.length > 0 && (
              <SortOptions
                sortBy={sortBy}
                onSortChange={handleSortChange}
                resultsCount={listings.length}
              />
            )}

            {/* Loading state */}
            {loading && page === 1 && <LoadingState />}

            {/* Error state */}
            {!loading && error && (
              <ErrorState error={error} onRetry={handleRetry} />
            )}

            {/* Empty state */}
            {!loading && !error && listings.length === 0 && <EmptyState />}

            {/* Results list */}
            {!loading && !error && listings.length > 0 && (
              <ListingsGrid listings={listings} onLoadMore={handleLoadMore} />
            )}

            {/* Load More Button */}
            {!loading && page < totalPages && (
              <button
                onClick={handleLoadMore}
                className="w-full mt-4 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
