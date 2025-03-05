import { mockListings } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "all";
  const subcategory = url.searchParams.get("subcategory") || "";
  const location = url.searchParams.get("location") || "all";
  const query = url.searchParams.get("q") || "";
  const minPrice = Number(url.searchParams.get("minPrice")) || 0;
  const maxPrice = Number(url.searchParams.get("maxPrice")) || Infinity;
  const sort = url.searchParams.get("sort") || "newest";
  const page = Number(url.searchParams.get("page")) || 1;
  const perPage = 10;

  let filteredListings = mockListings.filter((item) => {
    return (
      (category === "all" || item.category === category) &&
      (location === "all" || item.location === location) &&
      (subcategory === "" || item.subcategory === subcategory) &&
      (query === "" ||
        item.title.toLowerCase().includes(query.toLowerCase())) &&
      item.price !== null &&
      item.price >= minPrice &&
      item.price <= maxPrice
    );
  });

  // Sort Listings
  if (sort === "price_asc") {
    filteredListings.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === "price_desc") {
    filteredListings.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    filteredListings.sort(
      (a, b) => Number.parseInt(a.id) - Number.parseInt(b.id)
    ); // Default: newest
  }

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / perPage);
  const paginatedListings = filteredListings.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return NextResponse.json({ listings: paginatedListings, totalPages });
}
