"use client";

import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthState } from "../auth-dialog";

interface EmailFormProps {
  authState: AuthState;
  updateAuthState: (updates: Partial<AuthState>) => void;
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>;
  resetFlow: () => void;
}

export function EmailForm({
  authState,
  updateAuthState,
  handleEmailSubmit,
  resetFlow,
}: EmailFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={resetFlow}
          className="h-8 w-8 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to options</span>
        </Button>
        <span className="text-sm font-medium">Back to all options</span>
      </div>

      <div className="space-y-2">
        <Input
          ref={inputRef}
          type="email"
          placeholder="name@example.com"
          value={authState.email}
          onChange={(e) => updateAuthState({ email: e.target.value })}
          required
          disabled={authState.isLoading}
          className="h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (authState.email) handleEmailSubmit(e);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          We&apos;ll send a verification code to this email
        </p>
      </div>

      <Button
        type="submit"
        disabled={authState.isLoading || !authState.email}
        className="w-full"
      >
        {authState.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {authState.isLoading ? "Sending code..." : "Continue with email"}
      </Button>
    </form>
  );
}
