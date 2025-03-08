import { Tag } from "lucide-react";
import Pagination from "./pagination";
import ListingCard from "./listing-card";
import { getFilteredListings } from "@/app/actions/listings";

interface ListingsGridProps {
  categoryId?: string;
  subcategoryId?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
}

export default async function ListingsGrid({
  categoryId,
  subcategoryId,
  sort = "newest",
  minPrice,
  maxPrice,
  location,
  page = 1,
  limit = 10,
}: ListingsGridProps) {
  // Fetch listings with the given filters using the getFilteredListings function
  const { listings, totalPages } = await getFilteredListings({
    categoryId,
    subcategoryId,
    minPrice,
    maxPrice,
    location,
    page,
    limit,
    sortBy: sort, // Map the 'sort' prop to 'sortBy' for the backend function
  });

  // If no listings found
  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Tag className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No listings found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <p className="text-gray-600">
          Showing <span className="font-medium">{listings.length}</span>{" "}
          listings
        </p>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {listings.map((listing) => (
          <ListingCard key={listing.$id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          categoryId={categoryId}
          subcategoryId={subcategoryId}
          sort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
          location={location}
        />
      )}
    </div>
  );
}
