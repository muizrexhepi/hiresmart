database.createCollection("listings", {
  documentSecurity: false,
  permissions: ['read("any")', 'write("users")'],
});

database.createStringAttribute("listings", "title", 255, true);
database.createStringAttribute("listings", "titleMk", 255, true);
database.createStringAttribute("listings", "titleAl", 255, true);
database.createStringAttribute("listings", "description", 5000, true);
database.createStringAttribute("listings", "descriptionMk", 5000, true);
database.createStringAttribute("listings", "descriptionAl", 5000, true);
database.createFloatAttribute("listings", "price", true);
database.createEnumAttribute("listings", "currency", ["MKD", "EUR"], true);
database.createBooleanAttribute("listings", "negotiable", true);
database.createEnumAttribute(
  "listings",
  "condition",
  ["new", "used", "refurbished"],
  true
);
database.createStringAttribute("listings", "categoryId", 30, true);
database.createStringAttribute("listings", "subCategoryId", 30, true);
database.createStringAttribute("listings", "location", 255, true);
database.createFloatAttribute("listings", "latitude", true);
database.createFloatAttribute("listings", "longitude", true);
database.createEnumAttribute(
  "listings",
  "status",
  ["active", "sold", "expired", "deleted"],
  true
);
database.createStringAttribute("listings", "userId", 36, true);
database.createIntegerAttribute("listings", "views", true, 0);
database.createIntegerAttribute("listings", "favorites", true, 0);
database.createDatetimeAttribute("listings", "createdAt", true);
database.createDatetimeAttribute("listings", "updatedAt", true);
database.createDatetimeAttribute("listings", "expiresAt", true);
database.createStringAttribute("listings", "images", true, [], true); // Array of image IDs

// Create indexes for listings
database.createIndex("listings", "category_index", "key", ["categoryId"]);
database.createIndex("listings", "subcategory_index", "key", ["subCategoryId"]);
database.createIndex("listings", "user_index", "key", ["userId"]);
database.createIndex("listings", "created_index", "key", ["createdAt"]);
database.createIndex("listings", "location_index", "key", ["location"]);
database.createIndex("listings", "price_index", "key", ["price"]);
database.createIndex("listings", "status_index", "key", ["status"]);

// Users Collection
database.createCollection("users", {
  documentSecurity: true,
  permissions: ['read("any")', 'write("users")'],
});

database.createStringAttribute("users", "email", 255, true);
database.createStringAttribute("users", "phone", 20, true);
database.createStringAttribute("users", "name", 100, true);
database.createEnumAttribute(
  "users",
  "preferredLanguage",
  ["en", "mk", "al"],
  true
);
database.createStringAttribute("users", "location", 255, false);
database.createFloatAttribute("users", "rating", false, 0);
database.createIntegerAttribute("users", "totalListings", true, 0);
database.createDatetimeAttribute("users", "activeSince", true);
database.createDatetimeAttribute("users", "lastActive", true);
database.createStringAttribute("users", "avatarUrl", 255, false);
database.createBooleanAttribute("users", "verifiedPhone", true, false);
database.createBooleanAttribute("users", "verifiedEmail", true, false);

// Create indexes for users
database.createIndex("users", "email_index", "unique", ["email"]);
database.createIndex("users", "phone_index", "key", ["phone"]);
database.createIndex("users", "created_index", "key", ["activeSince"]);

// Messages Collection
database.createCollection("messages", {
  documentSecurity: true,
  permissions: ['read("users")', 'write("users")'],
});

database.createStringAttribute("messages", "listingId", 36, true);
database.createStringAttribute("messages", "senderId", 36, true);
database.createStringAttribute("messages", "receiverId", 36, true);
database.createStringAttribute("messages", "message", 1000, true);
database.createBooleanAttribute("messages", "read", true, false);
database.createDatetimeAttribute("messages", "createdAt", true);

// Create indexes for messages
database.createIndex("messages", "listing_index", "key", ["listingId"]);
database.createIndex("messages", "sender_index", "key", ["senderId"]);
database.createIndex("messages", "receiver_index", "key", ["receiverId"]);
database.createIndex("messages", "created_index", "key", ["createdAt"]);

// Favorites Collection
database.createCollection("favorites", {
  documentSecurity: true,
  permissions: ['read("users")', 'write("users")'],
});

database.createStringAttribute("favorites", "userId", 36, true);
database.createStringAttribute("favorites", "listingId", 36, true);
database.createDatetimeAttribute("favorites", "createdAt", true);

// Create indexes for favorites
database.createIndex("favorites", "user_listing_index", "unique", [
  "userId",
  "listingId",
]);

// Reviews Collection
database.createCollection("reviews", {
  documentSecurity: false,
  permissions: ['read("any")', 'write("users")'],
});

database.createStringAttribute("reviews", "userId", 36, true);
database.createStringAttribute("reviews", "reviewerId", 36, true);
database.createStringAttribute("reviews", "listingId", 36, true);
database.createIntegerAttribute("reviews", "rating", true);
database.createStringAttribute("reviews", "comment", 1000, true);
database.createDatetimeAttribute("reviews", "createdAt", true);

// Create indexes for reviews
database.createIndex("reviews", "user_index", "key", ["userId"]);
database.createIndex("reviews", "reviewer_index", "key", ["reviewerId"]);
database.createIndex("reviews", "listing_index", "key", ["listingId"]);
database.createIndex("reviews", "created_index", "key", ["createdAt"]);

// Reports Collection
database.createCollection("reports", {
  documentSecurity: true,
  permissions: ['read("team")', 'write("users")'],
});

database.createStringAttribute("reports", "listingId", 36, true);
database.createStringAttribute("reports", "reporterId", 36, true);
database.createStringAttribute("reports", "reason", 100, true);
database.createStringAttribute("reports", "description", 1000, true);
database.createEnumAttribute(
  "reports",
  "status",
  ["pending", "resolved", "rejected"],
  true
);
database.createDatetimeAttribute("reports", "createdAt", true);
database.createDatetimeAttribute("reports", "resolvedAt", false);

// Create indexes for reports
database.createIndex("reports", "listing_index", "key", ["listingId"]);
database.createIndex("reports", "reporter_index", "key", ["reporterId"]);
database.createIndex("reports", "status_index", "key", ["status"]);
database.createIndex("reports", "created_index", "key", ["createdAt"]);
