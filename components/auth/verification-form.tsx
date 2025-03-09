"use client";

import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import type { AuthState } from "../auth-dialog";

interface VerificationFormProps {
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  handleVerificationSubmit: (e: React.FormEvent) => Promise<void>;
}

export function VerificationForm({
  authState,
  updateAuthState,
  handleVerificationSubmit,
}: VerificationFormProps) {
  const otpRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Focus the OTP input when the component mounts
    const timer = setTimeout(() => {
      if (otpRef.current) {
        const input = otpRef.current.querySelector("input");
        if (input) input.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => updateAuthState({ isVerification: false })}
          className="h-8 w-8 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to email</span>
        </Button>
        <span className="text-sm font-medium">Back to email</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center py-2" ref={otpRef}>
          <InputOTP
            maxLength={6}
            value={authState.otp}
            onChange={(value) => updateAuthState({ otp: value })}
            disabled={authState.isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
          >
            Resend code
          </button>
        </p>
      </div>

      <Button
        type="submit"
        disabled={authState.isLoading || authState.otp.length !== 6}
        className="w-full"
      >
        {authState.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {authState.isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
}
