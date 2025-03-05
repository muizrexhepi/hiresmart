"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SubcategoryGridProps {
  category: {
    id: string;
    subCategories: {
      id: string;
      title: string;
    }[];
  };
  className?: string;
}

export default function SubcategoryGrid({
  category,
  className = "",
}: SubcategoryGridProps) {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Browse Subcategories
      </h2>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {category.subCategories.map((subcategory) => (
          <motion.div key={subcategory.id} variants={item}>
            <Link href={`/categories/${category.id}/${subcategory.id}`}>
              <Button
                variant="outline"
                className="w-full h-full py-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <span className="font-medium">{subcategory.title}</span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
