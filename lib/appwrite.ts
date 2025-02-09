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
  .setEndpoint("https://cloud.appwrite.io/v1") // Use your endpoint if self-hosted
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Project ID from Appwrite console

// Export instances of Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Collection IDs - store all your collection IDs here
export const Collections = {
  USERS: "users",
  SERVICES: "services",
  ORDERS: "orders",
  REVIEWS: "reviews",
} as const;

// Database ID
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Bucket IDs for different types of files
export const Buckets = {
  AVATARS: "avatars",
  SERVICE_IMAGES: "service-images",
  ATTACHMENTS: "attachments",
} as const;

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  try {
    const session = await account.getSession("current");
    return !!session;
  } catch {
    return false;
  }
}

// Helper function to get current user
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

// Type for user roles
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
