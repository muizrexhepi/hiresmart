"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/constants/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.titleMk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subCategories.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.titleMk.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Browse Categories
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Find what you're looking for across all categories
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Input
              type="search"
              placeholder="Search categories..."
              className="w-full h-12 pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${category.color} bg-opacity-10`}
                  >
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {category.titleMk}
                    </CardTitle>
                    <CardDescription>{category.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        href={`/category/${category.id}/${subCategory.id}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group transition-colors"
                      >
                        <span className="text-sm text-gray-600 group-hover:text-primary">
                          {subCategory.titleMk}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/category/${category.id}`}>
                      View All in {category.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Searches</h2>
        <div className="flex flex-wrap gap-3">
          {["Cars", "Apartments", "Mobile Phones", "Laptops", "Furniture"].map(
            (term) => (
              <Button
                key={term}
                variant="outline"
                className="rounded-full"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
