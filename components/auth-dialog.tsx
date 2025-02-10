import * as React from "react";
import Image from "next/image";
import { Apple, Facebook, Mail, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { account, authHelper } from "@/lib/appwrite";
import { useAuth } from "./providers/auth-provider";

export function AuthDialog() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [isEmailFlow, setIsEmailFlow] = React.useState(false);
  const [isVerification, setIsVerification] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const { refresh } = useAuth();

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authHelper.signInWithEmail(email);
      setUserId(res.userId);
      setIsVerification(true);
      await refresh();
    } catch (error) {
      console.error("Error sending verification code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log({ userId, otp });
      await account.createSession(userId, otp);
      setShowDialog(false);
      resetFlow();
    } catch (error) {
      console.error("Error verifying code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setIsEmailFlow(false);
    setIsVerification(false);
    setEmail("");
    setOtp("");
    setUserId("");
  };

  const renderVerificationFlow = () => (
    <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsVerification(false)}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Back to email</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          We've sent a verification code to {email}
        </p>
        <Input
          type="text"
          placeholder="Enter verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          disabled={isLoading}
          className="text-center text-lg tracking-widest"
          maxLength={6}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          "Verify Code"
        )}
      </Button>
    </form>
  );

  const renderEmailFlow = () => (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetFlow}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Back to all options</span>
      </div>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          "Continue with email"
        )}
      </Button>
    </form>
  );

  const renderInitialOptions = () => (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="flex items-center gap-2">
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
        className="flex items-center gap-2"
        onClick={() => setIsEmailFlow(true)}
      >
        <Mail className="h-5 w-5" />
        Continue with email
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Apple className="h-5 w-5" />
        Continue with Apple
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Facebook className="h-5 w-5" />
        Continue with Facebook
      </Button>
    </div>
  );

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button
            className="hidden md:inline-flex"
            onClick={() => setShowDialog(true)}
          >
            Login
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="grid md:grid-cols-2 p-0 md:max-w-[800px] h-full lg:h-[450px]">
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary" />
          <div className="relative h-full p-6 text-white">
            <h2 className="text-2xl font-bold mb-6">Success starts here</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                Over 700 categories
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                Quality work done faster
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                Access to talent and businesses across Macedonia
              </li>
            </ul>
            <Image
              src="/assets/images/auth-bg.jpg"
              alt="Professional working"
              fill
              className="object-cover -z-10 rounded-l-lg"
              priority
            />
          </div>
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isVerification
                ? "Enter verification code"
                : isEmailFlow
                ? "Enter your email"
                : "Sign in or join"}
            </DialogTitle>
            <DialogDescription>
              {isVerification
                ? "Check your email for the code"
                : isEmailFlow
                ? "We'll send you a verification code"
                : "Continue with your preferred login method"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isVerification
              ? renderVerificationFlow()
              : isEmailFlow
              ? renderEmailFlow()
              : renderInitialOptions()}
          </div>
          {!isVerification && (
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to the HireSmart Terms of Service and to
              occasionally receive emails from us. Please read our Privacy
              Policy to learn how we use your personal data.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
