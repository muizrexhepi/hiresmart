"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CATEGORIES } from "@/constants/categories";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS } from "@/constants/locations";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const category = selectedCategory
      ? encodeURIComponent(selectedCategory)
      : "all";
    const location = selectedLocation
      ? encodeURIComponent(selectedLocation)
      : "all";
    const searchParams = new URLSearchParams();

    if (searchQuery.trim()) {
      searchParams.append("q", searchQuery.trim());
    }

    router.push(`/search/${category}/${location}?${searchParams.toString()}`);
  };

  return (
    <div className="relative sm:py-4 lg:py-8 sm:container">
      <section className="bg-gradient-to-b from-[#023020] to-[#034530] relative overflow-hidden min-h-[600px] flex items-center sm:rounded-2xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40" />
          <Image
            src="/assets/images/bgImage.webp"
            alt="Background"
            width={1920}
            height={600}
            className="object-cover w-full h-full opacity-20 object-top"
          />
        </div>

        {/* Latest Listings Preview Cards */}
        <div className="absolute left-[5%] top-1/4 transform -translate-y-1/2 hidden md:block">
          <div className="w-48 h-64 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm p-3 shadow-lg rotate-[-6deg]">
            <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-gray-100">
              <Image
                src="/assets/images/iphone14.jpg"
                alt="Product"
                width={168}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-medium text-sm">Нов iPhone 14 Pro</h3>
            <p className="text-sm text-green-600 font-semibold">€899</p>
            <p className="text-xs text-gray-600 mt-1">Скопје, Центар</p>
          </div>
        </div>

        <div className="absolute right-[5%] bottom-1/4 transform translate-y-1/2 hidden md:block">
          <div className="w-48 h-64 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm p-3 shadow-lg rotate-[6deg]">
            <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-gray-100">
              <Image
                src="/assets/images/appartment.jpg"
                alt="Product"
                width={168}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-medium text-sm">Голем Стан во Центар</h3>
            <p className="text-sm text-green-600 font-semibold">€125,000</p>
            <p className="text-xs text-gray-600 mt-1">Скопје, Центар</p>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
              Buy and Sell <br />
              <span className="italic">in Macedonia</span>
              <span className="block text-xl md:text-2xl mt-4 font-sans text-gray-300 font-normal">
                Your trusted marketplace for buying and selling in Macedonia
              </span>
            </h1>

            <form
              onSubmit={handleSearch}
              className="relative max-w-3xl mx-auto mt-8"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-14 bg-white md:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex-1 relative">
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full h-14 border-0 shadow-lg"
                  />
                </div>
                <div className="flex-1 flex gap-2">
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="h-14 bg-white md:w-[160px] lg:flex-1">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="submit"
                    className="h-14 px-6 bg-[#023020] hover:bg-[#034530]0 transition-colors"
                  >
                    <Search className="!size-6" />
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-12">
              <p className="text-gray-400 mb-6">Popular Categories</p>
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.slice(0, 6).map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="bg-white/10 text-white hover:text-white border-white/20 hover:bg-white/20"
                      onClick={() => router.push(`/categories/${category.id}`)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.title}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
