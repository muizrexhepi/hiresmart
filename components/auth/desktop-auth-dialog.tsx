"use client";

import type * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AuthState } from "../auth-dialog";
import { AuthContent } from "./auth-content";

interface DesktopAuthDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
  handleVerificationSubmit: (e: React.FormEvent) => Promise<void>;
  resetFlow: () => void;
}

export function DesktopAuthDialog({
  showDialog,
  onOpenChange,
  authState,
  updateAuthState,
  handleEmailSubmit,
  handleVerificationSubmit,
  resetFlow,
}: DesktopAuthDialogProps) {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="hidden md:inline-flex"
          onClick={() => onOpenChange(true)}
        >
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="grid md:grid-cols-2 p-0 md:max-w-[800px] h-full lg:h-[500px] gap-0 overflow-hidden">
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/80 z-10" />
          <div className="relative h-full p-8 text-white z-20 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-8">Success starts here</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Over 700 categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Quality work done faster</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 rounded-full p-1 mt-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Access to talent and businesses across Macedonia</span>
                </li>
              </ul>
            </div>

            <div className="text-sm text-white/80">
              Join thousands of satisfied users today
            </div>
          </div>
          <Image
            src="/assets/images/auth-bg.jpg"
            alt="Professional working"
            fill
            className="object-cover -z-10 rounded-l-lg"
            priority
          />
        </div>

        <div className="p-8 flex flex-col">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold">
              {authState.isVerification
                ? "Verify your email"
                : authState.isEmailFlow
                ? "Sign in with email"
                : "Sign in or join"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {authState.isVerification
                ? "Enter the code we sent to your email"
                : authState.isEmailFlow
                ? "We'll send you a verification code"
                : "Continue with your preferred login method"}
            </DialogDescription>
          </DialogHeader>
          <AuthContent
            authState={authState}
            updateAuthState={updateAuthState}
            handleEmailSubmit={handleEmailSubmit}
            handleVerificationSubmit={handleVerificationSubmit}
            resetFlow={resetFlow}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
