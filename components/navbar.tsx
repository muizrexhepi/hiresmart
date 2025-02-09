"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, Menu, Search, Globe, X } from "lucide-react";

import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "./providers/auth-provider";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const { user, isLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white py-2">
      <div className="container flex h-16 items-center gap-2">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">HireSmart</span>
        </Link>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Briefcase className="h-6 w-6 mr-2" />
                HireSmart
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/categories">Categories</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/projects">Projects</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/about">About</Link>
              </Button>
              {!user ? (
                <>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowAuthDialog(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowAuthDialog(true);
                    }}
                  >
                    Join
                  </Button>
                </>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Македонски</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? <UserMenu user={user} /> : <AuthDialog />}
        </div>
      </div>
    </nav>
  );
}
