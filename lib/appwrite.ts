import {
  Client,
  Account,
  Databases,
  Storage,
  Functions,
  ID,
  OAuthProvider,
} from "appwrite";

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "",
  ratingsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_RATING_COLLECTION_ID || "",
  listingsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_LISTINGS_COLLECTION_ID || "",
  storageId: process.env.NEXT_PUBLIC_APPWRITE_USER_LISTINGS_STORAGE_ID || "",
};

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const Collections = {
  USERS: "users",
  SERVICES: "services",
  ORDERS: "orders",
  REVIEWS: "reviews",
} as const;

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const Buckets = {
  AVATARS: process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILE_PICTURE_BUCKET_ID!,
  SERVICE_IMAGES: "service-images",
  ATTACHMENTS: "attachments",
} as const;

export async function isAuthenticated() {
  try {
    const session = await account.getSession("current");
    return !!session;
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export type UserRole = "buyer" | "seller" | "admin";

// Authentication helper functions
export const authHelper = {
  // Sign in with email
  signInWithEmail: async (email: string) => {
    try {
      return await account.createEmailToken(ID.unique(), email);
    } catch (error) {
      throw error;
    }
  },

  // Sign in with OAuth providers
  signInWithGoogle: async () => {
    try {
      // return await account.createOAuth2Session(
      OAuthProvider.Google,
        "http://localhost:3000/auth/callback",
        "http://localhost:3000/auth/error";
      // );
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      throw error;
    }
  },
};
