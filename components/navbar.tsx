"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe, ChevronDown, X, Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "./providers/auth-provider";
import { SearchBar } from "@/app/search/(components)/search-bar";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isSearchPage = pathname?.startsWith("/search");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const categories = [
    { name: "Vehicles", href: "/categories/vehicles" },
    { name: "Real Estate", href: "/categories/real-estate" },
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Jobs", href: "/categories/jobs" },
    { name: "Home & Garden", href: "/categories/home-garden" },
    { name: "Sports & Recreation", href: "/categories/sports-recreation" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-200 bg-white border-b border-gray-100">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center md:gap-8">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 text-[#023020]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-xl font-black tracking-tight text-[#023020]">
                    TvojPazar.mk
                  </SheetTitle>
                </SheetHeader>

                <div className="p-6 flex-1 overflow-auto">
                  <div className="space-y-6">
                    {/* Categories Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Categories
                      </h3>
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <SheetClose key={category.href} asChild>
                            <Link
                              href={category.href}
                              className="flex items-center py-2 text-base"
                            >
                              {category.name}
                            </Link>
                          </SheetClose>
                        ))}
                        <SheetClose asChild>
                          <Link
                            href="/categories"
                            className="flex items-center py-2 text-base font-medium text-[#023020]"
                          >
                            View All Categories
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    {/* Language Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Language
                      </h3>
                      <div className="space-y-1">
                        <button className="flex items-center py-2 text-base w-full text-left">
                          <span className="font-medium">English</span>
                        </button>
                        <button className="flex items-center py-2 text-base w-full text-left">
                          <span>Македонски</span>
                        </button>
                      </div>
                    </div>

                    {user && (
                      <SheetClose asChild>
                        <Button
                          className="bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-2 w-full"
                          onClick={() => router.push("/listing/new")}
                        >
                          <Plus className="h-4 w-4" />
                          Post Ad
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black tracking-tight text-[#023020]">
              TvojPazar.mk
            </span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        {isSearchPage && (
          <div className="hidden md:block flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Categories Dropdown */}
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
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.href}>
                      <Link
                        href={category.href}
                        className="flex items-center gap-2 flex-1"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
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
