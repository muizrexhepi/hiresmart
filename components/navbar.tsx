"use client";

import * as React from "react";
import Link from "next/link";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "./providers/auth-provider";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user } = useAuth();

  // Handle navbar background change on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white shadow-sm py-2 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      {/* Top Bar */}
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black tracking-tight text-[#023020]">
              TvojPazar.mk
            </span>
          </Link>
        </div>

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
                      className="flex items-center gap-2"
                    >
                      Vehicles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/categories/real-estate"
                      className="flex items-center gap-2"
                    >
                      Real Estate
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/categories/electronics"
                      className="flex items-center gap-2"
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
          </div>

          {/* Language Selector */}
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

          {/* User Section */}
          {user ? <UserMenu user={user} /> : <AuthDialog />}

          {/* Mobile Menu */}
          {/* <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden text-[#023020] hover:text-[#034530] hover:bg-green-50"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <SheetTitle className="text-left text-lg font-semibold text-[#023020]">
                    Menu
                  </SheetTitle>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-base font-normal text-[#023020] hover:text-[#034530] hover:bg-green-50"
                    asChild
                  >
                    <Link href="/categories">Categories</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-base font-normal text-[#023020] hover:text-[#034530] hover:bg-green-50"
                    asChild
                  >
                    <Link href="/explore">Explore</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-base font-normal text-[#023020] hover:text-[#034530] hover:bg-green-50"
                    asChild
                  >
                    <Link href="/about">About</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-base font-normal text-[#023020] hover:text-[#034530] hover:bg-green-50"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        <span>English</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <span className="font-medium">English</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="font-medium">Македонски</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {!user && (
                    <Button
                      variant="default"
                      className="w-full mx-4 mt-4 bg-[#023020] text-white hover:bg-[#034530]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet> */}
        </div>
      </div>
    </nav>
  );
}
