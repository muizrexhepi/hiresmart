"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./providers/auth-provider";
import { SearchBar } from "@/app/search/(components)/search-bar";
import { Skeleton } from "./ui/skeleton";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white shadow-sm`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center md:gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black tracking-tight text-[#023020]">
              TvojPazar.mk
            </span>
          </Link>
        </div>

        {/* Only show SearchBar on search pages */}
        {isSearchPage && (
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-1 text-[#023020] hover:text-[#034530] hover:bg-green-50"
                >
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[280px]">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href="/categories/vehicles"
                      className="flex items-center gap-2 flex-1"
                    >
                      Vehicles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/categories/real-estate"
                      className="flex items-center gap-2 flex-1"
                    >
                      Real Estate
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/categories/electronics"
                      className="flex items-center gap-2 flex-1"
                    >
                      Electronics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href="/categories"
                      className="text-[#023020] font-medium"
                    >
                      View All Categories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 text-[#023020] hover:text-[#034530] hover:bg-green-50"
                >
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="font-medium">English</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="font-medium">Македонски</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth/User Menu */}
          {isLoading ? (
            <Skeleton className="h-10 w-[75px] rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <AuthDialog />
          )}
        </div>
      </div>

      {/* Mobile Search Bar - Only on search page */}
      {isSearchPage && (
        <div className="md:hidden border-t border-gray-100">
          <div className="container py-2">
            <SearchBar />
          </div>
        </div>
      )}
    </nav>
  );
}
