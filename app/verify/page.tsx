"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    const verifyMagicURL = async () => {
      if (userId && secret) {
        try {
          await account.createSession(userId, secret);
          // Successful verification - redirect to home or dashboard
          router.push("/");
        } catch (error) {
          console.error("Verification error:", error);
          // Handle error - redirect to error page or show error message
          router.push("/auth/error");
        }
      }
    };

    verifyMagicURL();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin" />
        <p className="text-muted-foreground">
          Please wait while we verify your login.
        </p>
      </div>
    </div>
  );
}
