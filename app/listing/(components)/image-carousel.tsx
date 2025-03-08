"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96 w-full">
        <img
          src={images[currentImageIndex] || "/assets/icons/placeholder.svg"}
          className="object-cover w-full h-full"
        />

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail navigation */}
      <div className="flex p-2 gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 ${
              currentImageIndex === index
                ? "border-emerald-500"
                : "border-transparent"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
