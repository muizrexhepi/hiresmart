import { NextResponse } from "next/server";

const mockListings = [
  {
    id: "1",
    title: "BMW X5 2020 - Excellent Condition",
    price: 15000,
    location: "skopje",
    category: "vehicles",
    subcategory: "cars",
    description: "Luxury SUV in excellent condition with full service history.",
    condition: "used",
    brand: "BMW",
    model: "X5",
    year: "2020",
    warranty: "Yes",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "2 days ago",
    seller: {
      id: "101",
      name: "AutoLux",
      image: "/seller1.png",
      memberSince: "2021",
      verified: true,
      rating: 4.9,
      totalListings: 25,
      responseRate: "90%",
      responseTime: "1 hour",
    },
    featured: true,
  },
  {
    id: "2",
    title: "Modern Apartment in City Center",
    price: 85000,
    location: "bitola",
    category: "real-estate",
    subcategory: "apartments",
    description: "Spacious 3-bedroom apartment in the heart of Bitola.",
    condition: "new",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "5 hours ago",
    seller: {
      id: "102",
      name: "RealEstateMK",
      image: "/seller2.png",
      memberSince: "2019",
      verified: true,
      rating: 4.7,
      totalListings: 40,
      responseRate: "85%",
      responseTime: "2 hours",
    },
    featured: false,
  },
  {
    id: "3",
    title: "iPhone 13 Pro - Like New",
    price: 750,
    location: "skopje",
    category: "electronics",
    subcategory: "phones",
    description: "iPhone 13 Pro with 256GB storage, barely used.",
    condition: "like new",
    brand: "Apple",
    model: "iPhone 13 Pro",
    year: "2021",
    warranty: "No",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "1 day ago",
    seller: {
      id: "103",
      name: "TechStoreMK",
      image: "/seller3.png",
      memberSince: "2020",
      verified: false,
      rating: 4.3,
      totalListings: 12,
      responseRate: "70%",
      responseTime: "4 hours",
    },
    featured: false,
  },
];

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
