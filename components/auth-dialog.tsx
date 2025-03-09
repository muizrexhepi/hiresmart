"use client";

import * as React from "react";
import { useMediaQuery } from "./hooks/use-media-query";
import { useAuth } from "./providers/auth-provider";
import { account, authHelper } from "@/lib/appwrite";
import { createUserOnFirstLogin } from "@/app/actions/users";
import { DesktopAuthDialog } from "./auth/desktop-auth-dialog";
import { MobileAuthSheet } from "./auth/mobile-auth-sheet";

export type AuthState = {
  isEmailFlow: boolean;
  isVerification: boolean;
  email: string;
  otp: string;
  isLoading: boolean;
  userId: string;
};

export function AuthDialog() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [showDialog, setShowDialog] = React.useState(false);
  const [showSheet, setShowSheet] = React.useState(false);
  const [authState, setAuthState] = React.useState<AuthState>({
    isEmailFlow: false,
    isVerification: false,
    email: "",
    otp: "",
    isLoading: false,
    userId: "",
  });
  const { refresh } = useAuth();

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...updates }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.email || authState.isLoading) return;

    updateAuthState({ isLoading: true });
    try {
      const res = await authHelper.signInWithEmail(authState.email);
      updateAuthState({ userId: res.userId, isVerification: true });
    } catch (error) {
      console.error("Error sending verification code:", error);
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateAuthState({ isLoading: true });
    try {
      await account.createSession(authState.userId, authState.otp);
      await createUserOnFirstLogin(authState.userId, authState.email);
      setShowDialog(false);
      setShowSheet(false);
      resetFlow();
      await refresh();
    } catch (error) {
      console.error("Error verifying code:", error);
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  const resetFlow = () => {
    setAuthState({
      isEmailFlow: false,
      isVerification: false,
      email: "",
      otp: "",
      isLoading: false,
      userId: "",
    });
  };

  const handleClose = (open: boolean) => {
    if (isDesktop) {
      setShowDialog(open);
    } else {
      setShowSheet(open);
    }
    if (!open) resetFlow();
  };

  if (isDesktop) {
    return (
      <DesktopAuthDialog
        showDialog={showDialog}
        onOpenChange={handleClose}
        authState={authState}
        updateAuthState={updateAuthState}
        handleEmailSubmit={handleEmailSubmit}
        handleVerificationSubmit={handleVerificationSubmit}
        resetFlow={resetFlow}
      />
    );
  }

  return (
    <MobileAuthSheet
      showSheet={showSheet}
      onOpenChange={handleClose}
      authState={authState}
      updateAuthState={updateAuthState}
      handleEmailSubmit={handleEmailSubmit}
      handleVerificationSubmit={handleVerificationSubmit}
      resetFlow={resetFlow}
    />
  );
}
