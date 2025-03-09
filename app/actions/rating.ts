import { databases, appwriteConfig } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { Rating } from "@/lib/types";

export async function rateUser(
  sellerId: string,
  raterId: string,
  value: number,
  comment?: string
): Promise<Rating> {
  try {
    // Check if user already rated this seller
    const existingRatings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ratingsCollectionId,
      [Query.equal("sellerId", sellerId), Query.equal("raterId", raterId)]
    );

    let ratingId;
    let rating;

    // If user already rated, update their rating
    if (existingRatings.documents.length > 0) {
      ratingId = existingRatings.documents[0].$id;
      rating = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.ratingsCollectionId,
        ratingId,
        {
          value,
          comment,
          updatedAt: new Date().toISOString(),
        }
      );
    } else {
      // Create new rating
      rating = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.ratingsCollectionId,
        ID.unique(),
        {
          sellerId,
          raterId,
          value,
          comment,
          createdAt: new Date().toISOString(),
        }
      );
    }

    // Update the seller's average rating
    await updateSellerRating(sellerId);

    return {
      id: rating.$id,
      sellerId: rating.sellerId,
      raterId: rating.raterId,
      value: rating.value,
      comment: rating.comment,
      createdAt: rating.createdAt,
    };
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error;
  }
}

/**
 * Get all ratings for a seller
 */
export async function getSellerRatings(sellerId: string): Promise<Rating[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ratingsCollectionId,
      [Query.equal("sellerId", sellerId)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      sellerId: doc.sellerId,
      raterId: doc.raterId,
      value: doc.value,
      comment: doc.comment,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching seller ratings:", error);
    return [];
  }
}

/**
 * Get user's rating for a specific seller (if exists)
 */
export async function getUserRatingForSeller(
  sellerId: string,
  raterId: string
): Promise<Rating | null> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ratingsCollectionId,
      [Query.equal("sellerId", sellerId), Query.equal("raterId", raterId)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    const doc = response.documents[0];
    return {
      id: doc.$id,
      sellerId: doc.sellerId,
      raterId: doc.raterId,
      value: doc.value,
      comment: doc.comment,
      createdAt: doc.createdAt,
    };
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
}

/**
 * Calculate and update the seller's average rating
 */
export async function updateSellerRating(sellerId: string): Promise<number> {
  try {
    // Get all ratings
    const ratings = await getSellerRatings(sellerId);

    if (ratings.length === 0) {
      return 0;
    }

    // Calculate average
    const totalValue = ratings.reduce((sum, rating) => sum + rating.value, 0);
    const averageRating = totalValue / ratings.length;

    // Update user document with new rating
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      sellerId,
      {
        rating: averageRating,
        totalRatings: ratings.length,
      }
    );

    return averageRating;
  } catch (error) {
    console.error("Error updating seller rating:", error);
    throw error;
  }
}
