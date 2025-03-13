"use client";

import { Search, X } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize query from URL on component mount
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    let searchPath = pathname;

    // If not already on a search page, go to the default search page
    if (!pathname.includes("/search/")) {
      searchPath = "/search/all/all";
    }

    // Create new search params based on current ones
    const params = new URLSearchParams(searchParams.toString());

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    router.push(`${searchPath}?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");

    // Remove only the query parameter but keep other parameters
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");

    // Keep the current path but update the query parameters
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl);
  };

  return (
    <div className="relative flex-grow xl:max-w-xl">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find listings..."
            className="w-full pl-10 pr-10 py-2 h-10 border border-gray-300 rounded-l-md rounded-r-none focus:outline-none focus:border-gray-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-10 px-5 text-white bg-[#023020] hover:bg-[#034530] rounded-r-md rounded-l-none transition-colors"
        >
          Search
        </Button>
      </form>
    </div>
  );
}
