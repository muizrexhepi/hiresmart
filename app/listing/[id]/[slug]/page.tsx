"use client";

import { useState, useEffect } from "react";
import { ListingHeader } from "../../(components)/listing-header";
import { ImageCarousel } from "../../(components)/image-carousel";
import { DescriptionBox } from "../../(components)/description-box";
import { AdditionalDetails } from "../../(components)/additional-details";
import { PriceContactBox } from "../../(components)/price-contact-box";
import { RelatedListings } from "../../(components)/related-listings";
import { FloatingActionButtons } from "../../(components)/floating-action-button";
import type { Listing } from "@/lib/types";
import { AlertCircle } from "lucide-react";

// Mock listing data that matches the Listing type
const mockListing: Listing = {
  id: "3",
  title: "iPhone 13 Pro - Like New",
  price: 750,
  location: "skopje",
  category: "electronics",
  subcategory: "phones",
  description:
    "Selling my iPhone 13 Pro that I purchased last year. It's in excellent condition with no scratches or dents. The battery health is at 92%. Comes with original box, charger, and unused earphones. AppleCare+ valid until November 2023. Reason for selling: upgraded to iPhone 14 Pro.\n\nSpecs:\n- 128GB Storage\n- Sierra Blue color\n- A15 Bionic chip\n- Pro camera system with 12MP cameras\n- Face ID\n- 5G capable\n\nI'm located in Skopje City Center and prefer in-person exchange. Price is slightly negotiable for serious buyers.",
  condition: "Used - Like New",
  brand: "Apple",
  model: "iPhone 13 Pro",
  year: "2022",
  warranty: "AppleCare+ until November 2023",
  images: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800&text=iPhone+Side",
    "/placeholder.svg?height=600&width=800&text=iPhone+Back",
    "/placeholder.svg?height=600&width=800&text=iPhone+Box",
  ],
  date: "1 day ago",
  seller: {
    id: "user123",
    name: "Alex Johnson",
    image: "/placeholder.svg?height=100&width=100",
    memberSince: "March 2020",
    verified: true,
    rating: 4.8,
    totalListings: 12,
    responseRate: "98%",
    responseTime: "Within 2 hours",
  },
  featured: false,
};

// Mock related listings that match the Listing type
const mockRelatedListings: Listing[] = [
  {
    id: "4",
    title: "Samsung Galaxy S22 Ultra",
    price: 850,
    location: "skopje",
    category: "electronics",
    subcategory: "phones",
    images: ["/placeholder.svg?height=200&width=300&text=Samsung"],
    date: "3 days ago",
    seller: {
      id: "user456",
      name: "Maria Smith",
      image: "/placeholder.svg?height=100&width=100",
      memberSince: "January 2021",
      verified: true,
      rating: 4.9,
      totalListings: 8,
      responseRate: "95%",
      responseTime: "Within 1 hour",
    },
  },
  {
    id: "5",
    title: "Google Pixel 7 Pro",
    price: 700,
    location: "bitola",
    category: "electronics",
    subcategory: "phones",
    images: ["/placeholder.svg?height=200&width=300&text=Pixel"],
    date: "5 days ago",
    seller: {
      id: "user789",
      name: "John Doe",
      image: "/placeholder.svg?height=100&width=100",
      memberSince: "June 2022",
      verified: false,
      rating: 4.5,
      totalListings: 3,
      responseRate: "90%",
      responseTime: "Within 3 hours",
    },
  },
  {
    id: "6",
    title: "iPhone 12 Pro Max",
    price: 600,
    location: "tetovo",
    category: "electronics",
    subcategory: "phones",
    images: ["/placeholder.svg?height=200&width=300&text=iPhone+12"],
    date: "1 week ago",
    seller: {
      id: "user101",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=100&width=100",
      memberSince: "April 2020",
      verified: true,
      rating: 4.7,
      totalListings: 15,
      responseRate: "97%",
      responseTime: "Within 2 hours",
    },
    featured: true,
  },
  {
    id: "7",
    title: "OnePlus 10 Pro",
    price: 550,
    location: "skopje",
    category: "electronics",
    subcategory: "phones",
    images: ["/placeholder.svg?height=200&width=300&text=OnePlus"],
    date: "2 days ago",
    seller: {
      id: "user202",
      name: "Mike Wilson",
      image: "/placeholder.svg?height=100&width=100",
      memberSince: "August 2021",
      verified: false,
      rating: 4.3,
      totalListings: 5,
      responseRate: "85%",
      responseTime: "Within 5 hours",
    },
  },
];

export default function ListingDetailsPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);

        // In a real app, you would fetch the actual listing data
        // const response = await fetch(`/api/listings/${params.id}`);
        // if (!response.ok) throw new Error('Failed to fetch listing details');
        // const data = await response.json();
        // setListing(data);

        // For now, simulate API fetch with mock data
        setTimeout(() => {
          setListing(mockListing);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load listing details. Please try again.");
        setLoading(false);
      }
    };

    const fetchRelatedListings = async () => {
      try {
        // In a real app, you would fetch related listings based on category/subcategory
        // const response = await fetch(`/api/search?category=${mockListing.category}&subcategory=${mockListing.subcategory}&exclude=${params.id}`);
        // if (!response.ok) throw new Error('Failed to fetch related listings');
        // const data: ListingsResponse = await response.json();
        // setRelatedListings(data.listings);

        // For now, use mock data
        setTimeout(() => {
          setRelatedListings(mockRelatedListings);
        }, 700);
      } catch (err) {
        console.error("Error fetching related listings:", err);
        // Don't set error state here as this is not critical for the main content
      }
    };

    fetchListingDetails();
    fetchRelatedListings();
  }, []);

  // Prepare additional details when listing is available
  const additionalDetails = listing
    ? [
        { label: "Condition", value: listing.condition },
        { label: "Brand", value: listing.brand },
        { label: "Model", value: listing.model },
        { label: "Year", value: listing.year },
        { label: "Warranty", value: listing.warranty, fullWidth: true },
      ].filter((detail) => detail.value) // Only include details that have values
    : [];

  // Action handlers
  const handleMessage = () => {
    console.log("Message seller", listing?.seller.id);
    // Implement your messaging logic here
  };

  const handleCall = () => {
    console.log("Call seller", listing?.seller.id);
    // Implement your call logic here
  };

  const handleSave = () => {
    console.log("Save listing", listing?.id);
    // Implement your save logic here
  };

  const handleShare = () => {
    if (typeof navigator.share === "function" && listing) {
      navigator
        .share({
          title: listing.title,
          text: `Check out this listing: ${listing.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      console.log("Share listing", listing?.id);
      // Copy to clipboard or show a share modal
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-red-700">Error</h2>
          </div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
            <h2 className="text-lg font-semibold text-amber-700">
              Listing Not Found
            </h2>
          </div>
          <p className="text-amber-600">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24">
        {/* Header */}
        <ListingHeader
          title={listing.title}
          category={listing.category}
          subcategory={listing.subcategory}
          location={listing.location}
          date={listing.date}
          featured={listing.featured}
          backUrl={`/search/${listing.category}/${listing.location}`}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          <div className="w-full lg:w-2/3">
            {/* Image carousel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <ImageCarousel images={listing.images} title={listing.title} />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <DescriptionBox
                description={listing.description || "No description provided."}
              />
            </div>

            {/* Additional details */}
            {additionalDetails.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <AdditionalDetails details={additionalDetails} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            {/* Price and contact */}
            <div className="">
              <PriceContactBox
                price={listing.price}
                seller={listing.seller}
                onMessage={handleMessage}
                onCall={handleCall}
                onSave={handleSave}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>

        {/* Related listings */}
        {relatedListings.length > 0 && (
          <div className="mt-12">
            <RelatedListings listings={mockRelatedListings} />
          </div>
        )}
      </div>

      {/* Floating action buttons (mobile only) */}
      <FloatingActionButtons
        price={listing.price}
        onMessage={handleMessage}
        onCall={handleCall}
        onSave={handleSave}
        onShare={handleShare}
      />
    </div>
  );
}
