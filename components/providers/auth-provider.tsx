"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Models, RealtimeResponseEvent } from "appwrite";
import { account, client } from "@/lib/appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    const unsubscribe = client.subscribe<RealtimeResponseEvent<Models.Session>>(
      "account",
      (response: any) => {
        if (response.events.includes("users.*.sessions.*.create")) {
          refresh();
        }
        if (response.events.includes("users.*.sessions.*.delete")) {
          setUser(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
