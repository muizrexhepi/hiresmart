import { databases, appwriteConfig } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { SavedListing } from "@/lib/types";

export async function toggleSavedListing(
  listingId: string,
  userId: string
): Promise<boolean> {
  try {
    // Check if listing is already saved by user
    const existingSaved = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      [Query.equal("listingId", listingId), Query.equal("userId", userId)]
    );

    // If already saved, delete it (unsave)
    if (existingSaved.documents.length > 0) {
      const savedId = existingSaved.documents[0].$id;
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savedListingsCollectionId,
        savedId
      );
      return false; // Indicating it's now unsaved
    }

    // Otherwise, save it
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      ID.unique(),
      {
        listingId,
        userId,
        createdAt: new Date().toISOString(),
      }
    );

    return true; // Indicating it's now saved
  } catch (error) {
    console.error("Error toggling saved listing:", error);
    throw error;
  }
}

/**
 * Check if a listing is saved by a user
 */
export async function isListingSaved(
  listingId: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      [Query.equal("listingId", listingId), Query.equal("userId", userId)]
    );

    return response.documents.length > 0;
  } catch (error) {
    console.error("Error checking saved status:", error);
    return false;
  }
}

/**
 * Get all listings saved by a user
 */
export async function getUserSavedListings(
  userId: string
): Promise<SavedListing[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      [Query.equal("userId", userId)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      listingId: doc.listingId,
      userId: doc.userId,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching user saved listings:", error);
    return [];
  }
}

/**
 * Get count of how many users saved a specific listing
 */
export async function getListingSaveCount(listingId: string): Promise<number> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      [Query.equal("listingId", listingId)]
    );

    return response.total;
  } catch (error) {
    console.error("Error getting listing save count:", error);
    return 0;
  }
}

/**
 * Delete all saved entries for a listing (useful when deleting a listing)
 */
export async function removeAllSavesForListing(
  listingId: string
): Promise<void> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savedListingsCollectionId,
      [Query.equal("listingId", listingId)]
    );

    // Delete each saved record
    for (const doc of response.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savedListingsCollectionId,
        doc.$id
      );
    }
  } catch (error) {
    console.error("Error removing saves for listing:", error);
    throw error;
  }
}
