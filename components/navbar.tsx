"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe, ChevronDown, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const isSearchPage = pathname?.startsWith("/search");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

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

        {isSearchPage && (
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-2xl mx-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-2 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </form>
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
          {user ? <UserMenu user={user} /> : <AuthDialog />}
        </div>
      </div>

      {/* Mobile Search Bar - Only on search page */}
      {isSearchPage && (
        <div className="md:hidden border-t border-gray-100">
          <form onSubmit={handleSearch} className="container py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find services..."
                className="w-full pl-10 pr-4 py-2 h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}
