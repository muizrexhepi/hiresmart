"use client";
import Image from "next/image";
import { Apple, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AuthState } from "../auth-dialog";

interface AuthOptionsProps {
  updateAuthState: (updates: Partial<AuthState>) => void;
}

export function AuthOptions({ updateAuthState }: AuthOptionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="flex items-center gap-3 h-11">
        <Image
          src="/assets/icons/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="h-5 w-5"
        />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-3 h-11"
        onClick={() => updateAuthState({ isEmailFlow: true })}
      >
        <Mail className="h-5 w-5" />
        Continue with email
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" className="flex items-center gap-3 h-11">
        <Apple className="h-5 w-5" />
        Continue with Apple
      </Button>

      <Button variant="outline" className="flex items-center gap-3 h-11">
        <Facebook className="h-5 w-5" />
        Continue with Facebook
      </Button>
    </div>
  );
}
