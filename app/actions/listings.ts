import { appwriteConfig, databases } from "@/lib/appwrite";
import { Listing, ListingStatus } from "@/lib/types";
import { Query, Models } from "appwrite";

function convertToListing(document: Models.Document): Listing {
  // First, extract the seller information if it exists
  let seller = undefined;
  if (document.seller) {
    // If seller is already in the correct format, use it directly
    if (typeof document.seller === "object" && document.seller.id) {
      seller = document.seller;
    }
    // Otherwise, we might need to construct it from raw data
    else {
      seller = {
        id: document.seller.id || document.sellerId || document.userId,
        name: document.seller.name || document.sellerName || "",
        image: document.seller.image || document.sellerImage || "",
        memberSince:
          document.seller.memberSince || document.sellerMemberSince || "",
        verified: document.seller.verified || document.sellerVerified || false,
        rating: document.seller.rating || document.sellerRating || 0,
        totalListings:
          document.seller.totalListings || document.sellerTotalListings || 0,
        responseRate:
          document.seller.responseRate || document.sellerResponseRate || "",
        responseTime:
          document.seller.responseTime || document.sellerResponseTime || "",
      };
    }
  }

  return {
    $id: document.$id,
    userId: document.userId,
    title: document.title,
    price: document.price !== undefined ? document.price : null,
    location: document.location,
    status: document.status || "active",
    images: document.images || [],
    category: document.category,
    subcategory: document.subcategory,
    description: document.description,
    condition: document.condition,
    brand: document.brand,
    model: document.model,
    year: document.year,
    warranty: document.warranty,
    mileage: document.mileage,
    gearbox: document.gearbox,
    fuel: document.fuel,
    engineSize: document.engineSize,
    color: document.color,
    doors: document.doors,
    seats: document.seats,
    driveType: document.driveType,
    bodyType: document.bodyType,
    features: document.features,
    createdAt: document.createdAt,
    featured: document.featured || false,
    seller: seller,
  };
}

async function updateUserListingCount(
  userId: string,
  increment: number
): Promise<boolean> {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    const currentCount = user.totalListings || 0;
    const newCount = Math.max(0, currentCount + increment);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      { totalListings: newCount }
    );

    return true;
  } catch (error) {
    console.error("Error updating user listing count:", error);
    return false;
  }
}

export async function getUserListings(userId: string): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );

    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }
}

export async function getListingById(
  listingId: string
): Promise<Listing | null> {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      listingId
    );

    return convertToListing(response);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus
): Promise<boolean> {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      listingId,
      { status }
    );
    return true;
  } catch (error) {
    console.error("Error updating listing status:", error);
    return false;
  }
}

export async function deleteListing(listingId: string): Promise<boolean> {
  try {
    // First get the listing to get the userId
    const listing = await getListingById(listingId);

    if (!listing) {
      return false;
    }

    // Delete the listing
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      listingId
    );

    // Update the user's totalListings count (decrement by 1)
    await updateUserListingCount(listing.userId, -1);

    return true;
  } catch (error) {
    console.error("Error deleting listing:", error);
    return false;
  }
}

export async function getListingsByLocation(
  location: string
): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.equal("location", location),
        Query.equal("status", "active"),
        Query.orderDesc("createdAt"),
      ]
    );

    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching listings by location:", error);
    return [];
  }
}

export async function getListingsByCategory(
  category: string
): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.equal("category", category),
        Query.equal("status", "active"),
        Query.orderDesc("createdAt"),
      ]
    );
    console.log({ response });
    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching listings by category:", error);
    return [];
  }
}

export async function getListingsBySubCategory(
  category: string,
  subcategory: string
): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.equal("category", category),
        Query.equal("subcategory", subcategory),
        Query.equal("status", "active"),
        Query.orderDesc("createdAt"),
      ]
    );
    console.log({ response });
    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching listings by subcategory:", error);
    return [];
  }
}

export async function searchListings(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
): Promise<{ listings: Listing[]; totalPages: number }> {
  try {
    // First, get total count for calculating total pages
    const countResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [Query.search("title", searchTerm), Query.equal("status", "active")]
    );

    const totalCount = countResponse.total;
    const totalPages = Math.ceil(totalCount / limit);

    // Then get paginated results
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.search("title", searchTerm),
        Query.equal("status", "active"),
        Query.orderDesc("createdAt"),
        Query.limit(limit),
        Query.offset((page - 1) * limit),
      ]
    );

    return {
      listings: response.documents.map(convertToListing),
      totalPages: totalPages,
    };
  } catch (error) {
    console.error("Error searching listings:", error);
    return { listings: [], totalPages: 0 };
  }
}

export async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.equal("featured", true),
        Query.equal("status", "active"),
        Query.limit(6),
      ]
    );

    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
}

export async function getRecentListings(limit = 8): Promise<Listing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [
        Query.equal("status", "active"),
        Query.orderDesc("createdAt"),
        Query.limit(limit),
      ]
    );

    return response.documents.map(convertToListing);
  } catch (error) {
    console.error("Error fetching recent listings:", error);
    return [];
  }
}

export async function getAllListings(
  page = 1,
  limit = 10
): Promise<{ listings: Listing[]; totalPages: number }> {
  try {
    const queries = [
      Query.equal("status", "active"),
      Query.orderDesc("createdAt"),
      Query.limit(limit),
      Query.offset((page - 1) * limit),
    ];

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      queries
    );

    // Get total count for pagination
    const countResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      [Query.equal("status", "active")]
    );

    const totalPages = Math.ceil(countResponse.total / limit);

    return {
      listings: response.documents.map(convertToListing),
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching all listings:", error);
    return { listings: [], totalPages: 0 };
  }
}

export async function getFilteredListings(params: {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  location?: string;
  condition?: string;
  brand?: string;
  year?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<{ listings: Listing[]; totalPages: number }> {
  try {
    const {
      categoryId,
      subcategoryId,
      minPrice,
      maxPrice,
      location,
      condition,
      brand,
      year,
      page = 1,
      limit = 10,
      sortBy = "newest",
    } = params;

    const queries = [Query.equal("status", "active")];

    if (categoryId) {
      queries.push(Query.equal("category", categoryId));
    }

    if (subcategoryId) {
      queries.push(Query.equal("subcategory", subcategoryId));
    }

    if (
      minPrice !== undefined &&
      minPrice !== "" &&
      typeof minPrice === "number"
    ) {
      queries.push(Query.greaterThanEqual("price", minPrice));
    }

    if (
      maxPrice !== undefined &&
      maxPrice !== "" &&
      typeof maxPrice === "number"
    ) {
      queries.push(Query.lessThanEqual("price", maxPrice));
    }

    if (location) {
      queries.push(Query.equal("location", location));
    }

    // Add new filters
    if (condition) {
      queries.push(Query.equal("condition", condition));
    }

    if (brand) {
      queries.push(Query.equal("brand", brand));
    }

    if (year) {
      queries.push(Query.equal("year", year));
    }
    if (sortBy === "newest") {
      queries.push(Query.orderDesc("createdAt"));
    } else if (sortBy === "oldest") {
      queries.push(Query.orderAsc("createdAt"));
    } else if (sortBy === "price-low") {
      // Changed from priceAsc
      queries.push(Query.orderAsc("price"));
    } else if (sortBy === "price-high") {
      // Changed from priceDesc
      queries.push(Query.orderDesc("price"));
    } else {
      // Default to newest
      queries.push(Query.orderDesc("createdAt"));
    }

    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      queries
    );

    // Get total count for pagination - exclude pagination related queries
    const countQueries = queries.filter(
      (q) => !q.toString().includes("limit") && !q.toString().includes("offset")
    );

    // Also remove sort queries for count
    const countFilters = countQueries.filter(
      (q) =>
        !q.toString().includes("orderDesc") &&
        !q.toString().includes("orderAsc")
    );

    const countResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      countFilters
    );

    const totalPages = Math.ceil(countResponse.total / limit);

    return {
      listings: response.documents.map(convertToListing),
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    return { listings: [], totalPages: 0 };
  }
}

export async function createListing(
  listing: Omit<Listing, "$id" | "createdAt">
): Promise<Listing | null> {
  try {
    const newListing = {
      ...listing,
      createdAt: new Date().toISOString(),
      status: listing.status || "active",
      featured: listing.featured || false,
    };

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      "unique()",
      newListing
    );

    // After creating the listing, update the user's totalListings count (increment by 1)
    await updateUserListingCount(listing.userId, 1);

    return convertToListing(response);
  } catch (error) {
    console.error("Error creating listing:", error);
    return null;
  }
}

export async function updateListing(
  listingId: string,
  data: Partial<Listing>
): Promise<Listing | null> {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.listingsCollectionId,
      listingId,
      data
    );

    return convertToListing(response);
  } catch (error) {
    console.error("Error updating listing:", error);
    return null;
  }
}
