"use client";

import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  defaultQuery: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ defaultQuery, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-sm mb-6">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for services..."
            className="w-full pl-12 pr-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-800"
          />
        </div>
        <Button
          type="submit"
          className="m-1 px-8 py-2.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Search
        </Button>
      </form>
    </div>
  );
}
