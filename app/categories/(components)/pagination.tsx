"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  categoryId?: string;
  subcategoryId?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  categoryId,
  subcategoryId,
  sort,
  minPrice,
  maxPrice,
  location,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Create URL with current filters and new page
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Always include the category if provided
    if (categoryId) {
      params.set("category", categoryId);
    }

    // Include subcategory if provided
    if (subcategoryId) {
      params.set("subcategory", subcategoryId);
    }

    // Set page parameter (only if not page 1)
    if (page !== 1) {
      params.set("page", page.toString());
    }

    // Sort parameter (only if not default)
    if (sort && sort !== "newest") {
      params.set("sort", sort);
    }

    // Price filters
    if (minPrice !== undefined && minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    }

    if (maxPrice !== undefined && maxPrice < 10000) {
      params.set("maxPrice", maxPrice.toString());
    }

    // Location filter
    if (location) {
      params.set("location", location);
    }

    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle pages
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <nav className="flex justify-center items-center mt-8">
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => router.push(createPageUrl(currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => router.push(createPageUrl(page as number))}
              className="h-10 w-10"
            >
              {page}
            </Button>
          );
        })}

        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => router.push(createPageUrl(currentPage + 1))}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </nav>
  );
}
