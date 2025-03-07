"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  Heart,
  BriefcaseIcon,
  Menu,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authHelper } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/auth-provider";
import { useMediaQuery } from "./hooks/use-media-query";

export function UserMenu({ user }: any) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSignOut = async () => {
    try {
      await authHelper.signOut();
      await refresh();
      router.push("/");
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Shared menu items component to avoid duplication
  const MenuItems = ({ isMobile = false }) => (
    <>
      <div className="flex flex-col space-y-1">
        <p
          className={`${
            isMobile ? "text-base" : "text-sm"
          } font-medium leading-none`}
        >
          {user?.name}
        </p>
        <p
          className={`${
            isMobile ? "text-sm" : "text-xs"
          } leading-none text-muted-foreground`}
        >
          {user?.email}
        </p>
      </div>

      {isMobile && <div className="h-4" />}

      <div className={isMobile ? "border-t border-b py-4 my-4 space-y-4" : ""}>
        <Link
          href="/profile"
          className={`flex items-center ${isMobile ? "py-2" : ""}`}
          onClick={() => isMobile && setIsSheetOpen(false)}
        >
          <User className={`${isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4"}`} />
          Profile
        </Link>
        <div
          className={`flex items-center text-red-600 cursor-pointer ${
            isMobile ? "mt-auto py-2" : ""
          }`}
          onClick={handleSignOut}
        >
          <LogOut className={`${isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4"}`} />
          Sign out
        </div>
      </div>
    </>
  );

  // Trigger button - same for both mobile and desktop
  const TriggerButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button>
  >((props, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className="relative rounded-full bg-transparent border transition-colors px-3"
      {...props}
    >
      <Menu color="black" size={30} />
      <Avatar className="size-6">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback>
          <UserCircle className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    </Button>
  ));
  TriggerButton.displayName = "TriggerButton";

  // Desktop dropdown menu
  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TriggerButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex cursor-pointer items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/my-services"
                className="flex cursor-pointer items-center"
              >
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                My Services
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/saved" className="flex cursor-pointer items-center">
                <Heart className="mr-2 h-4 w-4" />
                Saved Items
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex cursor-pointer items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Mobile sheet
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <TriggerButton />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <div className="flex flex-col h-full p-6">
          <SheetHeader className="flex justify-between items-center">
            <SheetTitle>Account</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full mt-6">
            <MenuItems isMobile={true} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
