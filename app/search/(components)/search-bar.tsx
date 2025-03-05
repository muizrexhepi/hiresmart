"use client";

import { Search, Filter } from "lucide-react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  defaultQuery: string;
  onSearch: (query: string) => void;
  toggleFilters: () => void;
}

export function SearchBar({
  defaultQuery,
  onSearch,
  toggleFilters,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const location = searchParams.get("location") || "all";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;

    // Call the onSearch function (optional)
    onSearch(query);

    // Build the new URL with the existing category and location, appending the query
    const newUrl = `/search/${category}/${location}?q=${query}`;

    // Update the URL without changing the path (keeping the category/location)
    router.push(newUrl);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="query"
              placeholder="Search for anything..."
              defaultValue={defaultQuery}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 md:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </form>
    </div>
  );
}
