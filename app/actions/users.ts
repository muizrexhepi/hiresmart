import { account, appwriteConfig, databases } from "@/lib/appwrite";
import { Seller } from "@/lib/types";
import { Models } from "appwrite";

function convertToSeller(document: Models.Document): Seller {
  return {
    id: document.id || document.$id,
    name: document.name,
    image: document.image || "/placeholder.svg?height=48&width=48",
    memberSince: document.memberSince || new Date().toLocaleDateString(),
    verified: document.verified || false,
    rating: document.rating || 0,
    totalListings: document.totalListings || 0,
    responseRate: document.responseRate || "N/A",
    responseTime: document.responseTime || "N/A",
  };
}

export async function getUserById(userId: string): Promise<Seller | null> {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    return convertToSeller(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function createUserOnFirstLogin(
  userId: string,
  email: string
): Promise<Seller | null> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const existingUser = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId
      );

      console.log("User document already exists");
      return convertToSeller(existingUser);
    } catch (error) {
      // Try to get user preferences for avatar
      let userAvatar = "/placeholder.svg?height=48&width=48";
      try {
        const userAccount = await account.get();
        if (userAccount.prefs && userAccount.prefs.avatar) {
          userAvatar = userAccount.prefs.avatar;
        }
      } catch (prefError) {
        console.error("Error fetching user preferences:", prefError);
      }

      const name = email ? email.split("@")[0] : "";

      const userData = {
        id: userId,
        name: name,
        image: userAvatar,
        memberSince: new Date().toISOString(),
        verified: false,
        rating: 0,
        totalListings: 0,
        responseRate: "N/A",
        responseTime: "N/A",
      };

      const newUserDoc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        userData
      );

      console.log("Created new user document:", newUserDoc);
      return convertToSeller(newUserDoc);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function updateUser(
  userId: string,
  data: Partial<Omit<Seller, "id">>
): Promise<Seller | null> {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      data
    );

    return convertToSeller(response);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function syncUserAvatar(userId: string): Promise<boolean> {
  try {
    // Get user avatar from account preferences
    const userAccount = await account.get();
    if (userAccount.prefs && userAccount.prefs.avatar) {
      // Update user document with the avatar from preferences
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        {
          image: userAccount.prefs.avatar,
        }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error syncing user avatar:", error);
    return false;
  }
}
