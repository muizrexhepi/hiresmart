"use client";

import type * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthContent } from "./auth-content";
import type { AuthState } from "../auth-dialog";

interface MobileAuthSheetProps {
  showSheet: boolean;
  onOpenChange: (open: boolean) => void;
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
  handleVerificationSubmit: (e: React.FormEvent) => Promise<void>;
  resetFlow: () => void;
}

export function MobileAuthSheet({
  showSheet,
  onOpenChange,
  authState,
  updateAuthState,
  handleEmailSubmit,
  handleVerificationSubmit,
  resetFlow,
}: MobileAuthSheetProps) {
  return (
    <Sheet open={showSheet} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="md:hidden" onClick={() => onOpenChange(true)}>
          Login
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[90vh] w-full p-0 rounded-t-xl">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex justify-between items-center p-6 border-b">
            <SheetTitle className="text-xl font-semibold">
              {authState.isVerification
                ? "Verify your email"
                : authState.isEmailFlow
                ? "Sign in with email"
                : "Sign in or join"}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>

          <div className="p-6 flex-1 overflow-auto">
            <p className="text-sm text-muted-foreground mb-6">
              {authState.isVerification
                ? "Enter the code we sent to your email"
                : authState.isEmailFlow
                ? "We'll send you a verification code"
                : "Continue with your preferred login method"}
            </p>
            <AuthContent
              authState={authState}
              updateAuthState={updateAuthState}
              handleEmailSubmit={handleEmailSubmit}
              handleVerificationSubmit={handleVerificationSubmit}
              resetFlow={resetFlow}
              isMobile={true}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
