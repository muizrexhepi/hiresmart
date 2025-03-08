"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Car,
  Briefcase,
  Sofa,
  Bike,
  Wrench,
  Building2,
  ShoppingBag,
  Smartphone,
  LucideIcon,
} from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface CategoryHeaderProps {
  category: {
    id: string;
    title: string;
    iconName: string;
    color: string;
    titleMk?: string;
  };
  subcategory?: {
    id: string;
    title: string;
    titleMk?: string;
  };
  breadcrumbs: Breadcrumb[];
}

// Type-safe icon map with explicit record type
const ICON_MAP: Record<string, LucideIcon> = {
  vehicles: Car,
  "real-estate": Building2,
  jobs: Briefcase,
  electronics: Smartphone,
  "home-garden": Sofa,
  sports: Bike,
  tools: Wrench,
  services: ShoppingBag,
};

export default function CategoryHeader({
  category,
  subcategory,
  breadcrumbs,
}: CategoryHeaderProps) {
  // Get the appropriate icon component with fallback
  const CategoryIcon = ICON_MAP[category.id] || ShoppingBag;

  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
              )}
              <Link
                href={crumb.href}
                className={`inline-flex items-center text-sm font-medium ${
                  index === breadcrumbs.length - 1
                    ? "text-gray-700 pointer-events-none"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {crumb.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* Category Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div
          className={`p-3 rounded-full ${category.color
            .replace("text-", "bg-")
            .replace("500", "100")}`}
        >
          <CategoryIcon className={`h-6 w-6 ${category.color}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {subcategory ? subcategory.title : category.title}
          </h1>
          {subcategory && (
            <p className="text-gray-600">Category: {category.title}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
