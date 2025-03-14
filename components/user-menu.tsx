"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  Heart,
  Plus,
  Package,
  MessageSquare,
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

  // Desktop dropdown menu
  if (isDesktop) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative rounded-full h-10 w-10 p-0 border-gray-200"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800">
                  {user?.name?.charAt(0) || <UserCircle className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
                  href="/listings/my"
                  className="flex cursor-pointer items-center"
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Listings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/saved"
                  className="flex cursor-pointer items-center"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Saved Items
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/messages"
                  className="flex cursor-pointer items-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
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
      </div>
    );
  }

  // Mobile sheet
  return (
    <div className="flex items-center gap-2">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="relative rounded-full h-10 w-10 p-0 border-gray-200"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800">
                {user?.name?.charAt(0) || <UserCircle className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-sm p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                    {user?.name?.charAt(0) || (
                      <UserCircle className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Account
                  </h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center py-2 text-base"
                      >
                        <User className="mr-3 h-5 w-5" />
                        Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/settings"
                        className="flex items-center py-2 text-base"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Marketplace
                  </h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/listings/my"
                        className="flex items-center py-2 text-base"
                      >
                        <Package className="mr-3 h-5 w-5" />
                        My Listings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/saved"
                        className="flex items-center py-2 text-base"
                      >
                        <Heart className="mr-3 h-5 w-5" />
                        Saved Items
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/messages"
                        className="flex items-center py-2 text-base"
                      >
                        <MessageSquare className="mr-3 h-5 w-5" />
                        Messages
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto text-red-600 hover:text-red-700 hover:bg-transparent"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
