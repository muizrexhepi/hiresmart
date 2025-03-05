"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export function EmptyState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClearFilters = () => {
    // Reset URL by removing query params
    const category = searchParams.get("category") || "all";
    const location = searchParams.get("location") || "all";

    // Push the URL with only category and location (no query params)
    router.push(`/search/${category}/${location}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-md p-8 text-center"
    >
      <div className="text-gray-500 mb-2 text-lg">No results found</div>
      <p className="text-gray-400 mb-4">
        Try adjusting your search or filter criteria
      </p>
      <button
        onClick={handleClearFilters}
        className="inline-flex items-center px-4 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors"
      >
        Clear Filters
      </button>
    </motion.div>
  );
}
