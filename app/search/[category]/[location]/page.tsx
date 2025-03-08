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
import {
  getFilteredListings,
  getListingsByCategory,
  getListingsByLocation,
  searchListings,
  getAllListings,
} from "@/app/actions/listings";

const SearchPage = ({
  params,
}: {
  params: { category: string; location: string };
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const subcategoryParam = searchParams.get("subcategory") || "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam ? parseInt(minPriceParam) : "",
    max: maxPriceParam ? parseInt(maxPriceParam) : "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(subcategoryParam);

  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update state when URL params change
  useEffect(() => {
    if (minPriceParam) {
      setPriceRange((prev) => ({ ...prev, min: parseInt(minPriceParam) }));
    }

    if (maxPriceParam) {
      setPriceRange((prev) => ({ ...prev, max: parseInt(maxPriceParam) }));
    }

    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [minPriceParam, maxPriceParam, subcategoryParam]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let result: { listings: Listing[]; totalPages: number } = {
        listings: [],
        totalPages: 0,
      };

      if (query) {
        // Search by query takes precedence
        const searchResults = await searchListings(query);
        result = {
          listings: searchResults,
          totalPages: Math.ceil(searchResults.length / 10),
        };
      } else if (
        (params.category === "all" || !params.category) &&
        (params.location === "all" || !params.location) &&
        !selectedSubcategory &&
        !priceRange.min &&
        !priceRange.max
      ) {
        // If everything is "all" and no filters, get all listings
        const allListings = await getAllListings(page, 10);
        result = {
          listings: allListings.listings,
          totalPages: allListings.totalPages,
        };
      } else if (params.category && params.category !== "all") {
        if (params.location && params.location !== "all") {
          // Both category and location specified
          result = await getFilteredListings({
            categoryId: params.category,
            subcategoryId: selectedSubcategory,
            location: params.location,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: page,
            limit: 10,
            sortBy: sortBy,
          });
        } else {
          // Only category is specified
          result = await getFilteredListings({
            categoryId: params.category,
            subcategoryId: selectedSubcategory,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            page: page,
            limit: 10,
            sortBy: sortBy,
          });
        }
      } else if (params.location && params.location !== "all") {
        // Only location is specified
        result = await getFilteredListings({
          location: params.location,
          subcategoryId: selectedSubcategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          page: page,
          limit: 10,
          sortBy: sortBy,
        });
      } else {
        // Only filters are specified
        result = await getFilteredListings({
          subcategoryId: selectedSubcategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          page: page,
          limit: 10,
          sortBy: sortBy,
        });
      }

      setListings((prevListings) =>
        page === 1 ? result.listings : [...prevListings, ...result.listings]
      );
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    params.category,
    params.location,
    query,
    priceRange.min,
    priceRange.max,
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
    setShowFilters((prev) => !prev);
  };

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value === "" ? "" : parseInt(value),
    }));
    setPage(1);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setPage(1);
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
            {showFilters && (
              <FiltersSidebar
                selectedCategory={params.category}
                selectedSubcategory={selectedSubcategory}
                onSubcategoryChange={handleSubcategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                selectedLocation={params.location}
              />
            )}
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
            {!loading && !error && page < totalPages && (
              <button
                onClick={handleLoadMore}
                className="w-full mt-4 p-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
              >
                Load More
              </button>
            )}

            {/* Loading more indicator */}
            {loading && page > 1 && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
