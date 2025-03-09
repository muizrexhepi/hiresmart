"use client";

import type * as React from "react";
import { AuthOptions } from "./auth-options";

import type { AuthState } from "../auth-dialog";
import { VerificationForm } from "./verification-form";
import { EmailForm } from "./email-form";

interface AuthContentProps {
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
  handleVerificationSubmit: (e: React.FormEvent) => Promise<void>;
  resetFlow: () => void;
  isMobile?: boolean;
}

export function AuthContent({
  authState,
  updateAuthState,
  handleEmailSubmit,
  handleVerificationSubmit,
  resetFlow,
  isMobile = false,
}: AuthContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 ${isMobile ? "py-2" : "py-4"}`}>
        {authState.isVerification ? (
          <VerificationForm
            authState={authState}
            updateAuthState={updateAuthState}
            handleVerificationSubmit={handleVerificationSubmit}
          />
        ) : authState.isEmailFlow ? (
          <EmailForm
            authState={authState}
            updateAuthState={updateAuthState}
            handleEmailSubmit={handleEmailSubmit}
            resetFlow={resetFlow}
          />
        ) : (
          <AuthOptions updateAuthState={updateAuthState} />
        )}
      </div>

      {!authState.isVerification && (
        <p className="text-xs text-muted-foreground mt-4">
          By continuing, you agree to the TvojPazar.mk Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      )}
    </div>
  );
}
